import api from '../../../shared/services/api';
import type { Organization } from '../types';

export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await api.get('/organizations');
    return response.data.sort((a: Organization, b: Organization) => a.order - b.order);
  },

  async createOrganization(organization: Omit<Organization, 'id'>): Promise<Organization> {
    const response = await api.post('/organizations', organization);
    return response.data;
  },

  async updateOrganization(id: string | number, organization: Partial<Organization>): Promise<Organization> {
    const response = await api.put(`/organizations/${id}`, organization);
    return response.data;
  },

  async deleteOrganization(id: string | number): Promise<void> {
    await api.delete(`/organizations/${id}`);
  }
}; 