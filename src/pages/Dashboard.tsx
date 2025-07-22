import React, { useEffect, useState } from 'react';
import type { Request, User } from '../types/index.ts';
import * as api from '../services/api';
import { RequestList } from '../components/RequestList';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const [requestsData, usersData] = await Promise.all([
          user.role === 'admin' 
            ? api.getRequests()
            : api.getUserRequests(Number(user.id)),
          api.getUsers()
        ]);
        setRequests(requestsData);
        setUsers(usersData);
      } catch (error) {
        setError('Talepler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">{error}</div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{user?.role === 'admin' ? 'Tüm Talepler' : 'Taleplerim'}</h2>
      {requests.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">Henüz talep bulunmamaktadır.</div>
      ) : (
        <RequestList requests={requests} users={user?.role === 'admin' ? users : undefined} />
      )}
    </div>
  );
}; 