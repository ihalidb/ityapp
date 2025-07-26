import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestForm } from './RequestForm';
import { useRequests } from '../hooks/useRequests';
import { useAuth } from '../../auth/hooks/useAuth';
import type { RequestFormData } from '../types';

export const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useRequests(user);
  const [error, setError] = useState('');

  const handleSubmit = async (data: RequestFormData) => {
    try {
      await createRequest(data);
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