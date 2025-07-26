import api from '../../../shared/services/api';
import type { User, Role } from '../../../shared/types';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/users', user);
    return response.data;
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getRoles(): Promise<Role[]> {
    const response = await api.get('/roles');
    return response.data.sort((a: Role, b: Role) => a.order - b.order);
  },

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await api.post('/roles', role);
    return response.data;
  },

  async updateRole(id: number, role: Partial<Role>): Promise<Role> {
    const currentRole = await api.get(`/roles/${id}`);
    if (currentRole.data.code === 'admin') {
      throw new Error('Admin rolü düzenlenemez!');
    }
    const response = await api.patch(`/roles/${id}`, role);
    return response.data;
  },

  async deleteRole(id: number): Promise<void> {
    const currentRole = await api.get(`/roles/${id}`);
    if (currentRole.data.code === 'admin') {
      throw new Error('Admin rolü silinemez');
    }
    await api.delete(`/roles/${id}`);
  }
}; 