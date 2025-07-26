import type { User, LoginCredentials } from '../../../shared/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData extends LoginCredentials {}

export interface AuthResponse {
  user: User;
  token?: string;
} 