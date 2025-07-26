import React from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  
  return (
    <div className="auth-context">
      {children}
    </div>
  );
}; 