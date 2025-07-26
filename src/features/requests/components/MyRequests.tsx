import React from 'react';
import { RequestList } from './RequestList';
import { useRequests } from '../hooks/useRequests';
import { useAuth } from '../../auth/hooks/useAuth';

export const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const { requests, loading, error, fetchUserRequests } = useRequests(user);

  React.useEffect(() => {
    if (user) {
      fetchUserRequests();
    }
  }, [user, fetchUserRequests]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Kendi Taleplerim</h2>
      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Henüz talep bulunmamaktadır.</div>
      ) : (
        <RequestList requests={requests} />
      )}
    </div>
  );
}; 