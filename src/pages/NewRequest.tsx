import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestForm } from '../components/RequestForm';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import type { Request } from '../types/index.ts';

export const NewRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (data: Omit<Request, 'id' | 'status' | 'userId' | 'createdAt'>) => {
    try {
      if (!user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }
      await api.createRequest({
        ...data,
        status: 'pending',
        userId: user.id,
      });
      navigate('/');
    } catch (err) {
      setError('Talep oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Yeni Talep Oluştur</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2">{error}</div>}
      <RequestForm onSubmit={handleSubmit} />
    </div>
  );
}; 