import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    let userDocListener: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!mounted) return;

        try {
          if (!user) {
            setState(prev => ({ ...prev, user: null, loading: false, isAdmin: false }));
            return;
          }

          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (!mounted) return;

          if (!userDoc.exists()) {
            await setDoc(userRef, {
              email: user.email,
              createdAt: serverTimestamp(),
              lastActivity: serverTimestamp(),
              role: 'user',
              watchedMovies: {},
              unavailableMovies: {},
              followers: [],
              following: [],
              bio: '',
              avatarUrl: ''
            });
          } else {
            await setDoc(
              userRef,
              { lastActivity: serverTimestamp() },
              { merge: true }
            );
          }

          if (!mounted) return;

          setState({
            user,
            loading: false,
            isAdmin: userDoc.data()?.role === 'admin',
            error: null
          });
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (!mounted) return;

          setState(prev => ({
            ...prev,
            user: user, // Keep the user object even if there's an error
            loading: false,
            error: error instanceof Error ? error : new Error('Authentication error')
          }));
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        if (!mounted) return;

        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Authentication error')
        }));
      }
    );

    return () => {
      mounted = false;
      if (userDocListener) {
        userDocListener();
      }
      unsubscribe();
    };
  }, []);

  return state;
}