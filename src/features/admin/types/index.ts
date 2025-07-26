import type { User, Role, PageKey } from '../../../shared/types';

export interface AdminState {
  users: User[];
  roles: Role[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  selectedRole: Role | null;
}

export interface UserFormData {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
}

export interface RoleFormData {
  name: string;
  code: string;
  order: number;
  allowedPages: PageKey[];
} 