import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './index.css';
import App from './App';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import Home from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Progress } from './pages/Progress';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { firebaseConfig } from './lib/config';

// Initialize Firebase
initializeApp(firebaseConfig);
getAuth();
getFirestore();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: 'movie/:id',
        element: (
          <ProtectedRoute>
            <MovieDetails />
          </ProtectedRoute>
        )
      },
      {
        path: 'progress',
        element: (
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        )
      },
      {
        path: 'community',
        element: (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile/:userId',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        )
      }
    ]
  }
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);