import api from '../../../shared/services/api';
import type { Request } from '../types';
import type { Department } from '../../../shared/types';

export const requestService = {
  async getRequests(): Promise<Request[]> {
    const response = await api.get('/requests');
    return response.data;
  },

  async getUserRequests(userId: number): Promise<Request[]> {
    const response = await api.get('/requests', {
      params: { userId },
    });
    return response.data;
  },

  async createRequest(request: Omit<Request, 'id' | 'createdAt' | 'createdTime' | 'statusUpdatedAt' | 'statusUpdatedBy' | 'statusNote'>): Promise<Request> {
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
  },

  async updateRequest(requestId: number | string, request: Partial<Request>): Promise<Request> {
    const response = await api.patch(`/requests/${requestId}`, request);
    return response.data;
  },

  async getDepartments(): Promise<Department[]> {
    const response = await api.get('/departments');
    return response.data;
  }
}; 