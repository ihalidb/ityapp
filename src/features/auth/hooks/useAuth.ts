import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { LoginCredentials, User, PageKey } from '../../../shared/types';
import type { AuthState } from '../types';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const user = authService.getUserFromStorage();
    if (user) {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        loading: false
      }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await authService.login(credentials);
      authService.saveUserToStorage(user);
      
      setState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }, []);

  const refreshUserPermissions = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const roles = await authService.getRoles();
      const userRole = roles.find(role => role.code === state.user?.role);
      
      if (userRole && state.user) {
        const updatedUser = { ...state.user, allowedPages: userRole.allowedPages };
        authService.saveUserToStorage(updatedUser);
        setState(prev => ({ ...prev, user: updatedUser }));
      } else if (state.user && !state.user.allowedPages) {
        // If no role found but user exists, set default pages
        const defaultPages: PageKey[] = ['dashboard', 'my-requests', 'new-request'];
        const updatedUser = { 
          ...state.user, 
          allowedPages: defaultPages
        };
        authService.saveUserToStorage(updatedUser);
        setState(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (error) {
      console.error('Failed to refresh user permissions:', error);
      // Don't throw error to prevent infinite loops
    }
  }, [state.user]);

  return {
    ...state,
    login,
    logout,
    refreshUserPermissions
  };
}; 