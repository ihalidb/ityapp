import axios from 'axios';
import type { LoginCredentials, Request, User, Department, Role } from '../types/index.ts';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.get('/users', { params: credentials });
  if (response.data.length === 0) {
    throw new Error('Invalid credentials');
  }
  return response.data[0];
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles');
  // Rolleri sıralama numarasına göre sırala
  return response.data.sort((a: Role, b: Role) => a.order - b.order);
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  const response = await api.post('/roles', role);
  return response.data;
};

export const updateRole = async (id: number, role: Partial<Role>): Promise<Role> => {
  const response = await api.patch(`/roles/${id}`, role);
  return response.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

export const updateRoleOrder = async (roles: Role[]): Promise<void> => {
  // Her rolün sırasını güncelle
  await Promise.all(
    roles.map((role, index) =>
      api.patch(`/roles/${role.id}`, { order: index })
    )
  );
};

export const getRequests = async (): Promise<Request[]> => {
  const response = await api.get('/requests');
  return response.data;
};

export const getUserRequests = async (userId: number): Promise<Request[]> => {
  const response = await api.get('/requests', {
    params: { userId },
  });
  return response.data;
};

export const createRequest = async (request: Omit<Request, 'id' | 'createdAt' | 'createdTime' | 'statusUpdatedAt' | 'statusUpdatedBy' | 'statusNote'>): Promise<Request> => {
  const now = new Date();
  const response = await api.post('/requests', {
    ...request,
    createdAt: now.toISOString(),
    createdTime: now.toLocaleTimeString('tr-TR'),
    statusUpdatedAt: null,
    statusUpdatedBy: null,
    statusNote: null,
  });
  return response.data;
};

export const updateRequest = async (requestId: number | string, request: Partial<Request>): Promise<Request> => {
  const response = await api.patch(`/requests/${requestId}`, request);
  return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get('/departments');
  return response.data;
};