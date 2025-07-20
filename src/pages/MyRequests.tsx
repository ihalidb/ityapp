import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import type { Request } from '../types';
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
    return <Typography>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kendi Taleplerim
      </Typography>
      <RequestList requests={requests} />
    </Box>
  );
}; 