import { useState, useEffect, useCallback } from 'react';
import { organizationService } from '../services/organizationService';
import type { Organization, OrganizationFormData } from '../types';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationService.getOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError('Organizasyon bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganization = useCallback(async (data: OrganizationFormData) => {
    try {
      setError(null);
      const cleanData = {
        ...data,
        photo: data.photo.trim() || '',
        name: data.name.trim(),
        position: data.position.trim()
      };
      
      await organizationService.createOrganization(cleanData);
      await fetchOrganizations();
    } catch (err) {
      setError('Organizasyon üyesi eklenirken bir hata oluştu');
      throw err;
    }
  }, [fetchOrganizations]);

  const updateOrganization = useCallback(async (id: string, data: Partial<OrganizationFormData>) => {
    try {
      setError(null);
      const cleanData = {
        ...data,
        photo: data.photo?.trim() || '',
        name: data.name?.trim() || '',
        position: data.position?.trim() || ''
      };
      
      await organizationService.updateOrganization(id, cleanData);
      await fetchOrganizations();
    } catch (err) {
      setError('Organizasyon üyesi güncellenirken bir hata oluştu');
      throw err;
    }
  }, [fetchOrganizations]);

  const deleteOrganization = useCallback(async (id: string) => {
    try {
      setError(null);
      await organizationService.deleteOrganization(id);
      await fetchOrganizations();
    } catch (err) {
      setError('Organizasyon üyesi silinirken bir hata oluştu');
      throw err;
    }
  }, [fetchOrganizations]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetch: fetchOrganizations
  };
}; 