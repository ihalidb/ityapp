import React from 'react';
import { AuthProvider } from './app/providers/AuthProvider';
import { AppRouter } from './app/routing/AppRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App; 