import { useState, useEffect, useCallback } from 'react';
import { requestService } from '../services/requestService';
import type { Request, RequestFormData } from '../types';
import type { User } from '../../../shared/types';

export const useRequests = (user?: User | null) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      setError('Talepler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getUserRequests(user.id);
      setRequests(data);
    } catch (err) {
      setError('Talepler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createRequest = useCallback(async (data: RequestFormData) => {
    if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
    
    try {
      setError(null);
      await requestService.createRequest({
        ...data,
        status: 'pending',
        userId: user.id,
      });
      await fetchUserRequests();
    } catch (err) {
      setError('Talep oluşturulurken bir hata oluştu');
      throw err;
    }
  }, [user, fetchUserRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    createRequest,
    fetchRequests,
    fetchUserRequests,
    refetch: fetchRequests
  };
}; 