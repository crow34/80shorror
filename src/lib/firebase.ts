import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(error => {
  console.warn('Auth persistence failed:', error);
});

// Initialize Firestore with enhanced offline support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({
      forceOwnership: true
    })
  })
});