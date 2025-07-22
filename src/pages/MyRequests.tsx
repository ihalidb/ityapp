import { useEffect, useState } from 'react';
import type { Request } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { RequestList } from '../components/RequestList';

export const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const data = await api.getUserRequests(user.id);
        setRequests(data);
      } catch (err) {
        setError('Talepler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center mt-8"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kendi Taleplerim</h2>
      <RequestList requests={requests} />
    </div>
  );
}; 