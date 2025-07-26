import React, { useState, useEffect } from 'react';
import { RequestList } from '../../requests/components/RequestList';
import { useRequests } from '../../requests/hooks/useRequests';
import { useAuth } from '../../auth/hooks/useAuth';
import type { User } from '../../../shared/types';

export const RequestManagement: React.FC = () => {
  const { user } = useAuth();
  const { requests, loading, error } = useRequests(user);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Talep Yönetimi</h2>
        <p className="text-gray-600">Tüm talepleri görüntüleyin ve yönetin</p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 mt-8">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Henüz talep bulunmamaktadır.</div>
      ) : (
        <RequestList requests={requests} users={users} />
      )}
    </div>
  );
}; 