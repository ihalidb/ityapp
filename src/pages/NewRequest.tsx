import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Yeni Talep Oluştur
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <RequestForm onSubmit={handleSubmit} />
    </Box>
  );
}; 