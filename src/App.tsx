import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Outlet } from 'react-router-dom';
import { Loader } from './components/Loader';
import { useAuth } from './hooks/useAuth';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}

export default App;