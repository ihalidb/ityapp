import api from '../../../shared/services/api';
import type { LoginCredentials, User, Role, PageKey } from '../../../shared/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.get('/users', { params: credentials });
    if (response.data.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = response.data[0];
    
    // Fetch user's role details including allowedPages
    try {
      const rolesResponse = await api.get('/roles');
      const roles: Role[] = rolesResponse.data;
      const userRole = roles.find(role => role.code === user.role);
      
      if (userRole) {
        user.allowedPages = userRole.allowedPages;
      } else {
        // Default pages if role not found
        const defaultPages: PageKey[] = ['dashboard', 'my-requests', 'new-request'];
        user.allowedPages = defaultPages;
      }
    } catch (error) {
      console.error('Failed to fetch role details:', error);
      // Default pages if API fails
      const defaultPages: PageKey[] = ['dashboard', 'my-requests', 'new-request'];
      user.allowedPages = defaultPages;
    }
    
    return user;
  },

  async getRoles(): Promise<Role[]> {
    const response = await api.get('/roles');
    return response.data.sort((a: Role, b: Role) => a.order - b.order);
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Ensure allowedPages exists
      if (!user.allowedPages) {
        // Default pages if missing
        const defaultPages: PageKey[] = ['dashboard', 'my-requests', 'new-request'];
        user.allowedPages = defaultPages;
        // Save back to storage
        this.saveUserToStorage(user);
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
}; 