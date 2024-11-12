import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skull, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !email || !password) return;

    if (!isOnline) {
      setError('Please check your internet connection and try again.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          email,
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
      }

      // Navigate after successful auth
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Auth error:', error);
      
      const errorMessages: { [key: string]: string } = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/network-request-failed': 'Connection error. Please check your internet connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
      };

      setError(errorMessages[error.code] || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg border-2 border-red-500">
        <div className="text-center">
          <Skull className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-shadow-glow">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-500">Offline</span>
              </>
            )}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-red-500 bg-black text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-red-500 bg-black text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-sm text-red-400 hover:text-red-300 w-full text-center"
          disabled={loading}
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}