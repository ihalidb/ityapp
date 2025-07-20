import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
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
        
        // Debug için user.id'yi yazdıralım
        console.log('Current user ID:', user.id, typeof user.id);
        
        const [requestsData, usersData] = await Promise.all([
          user.role === 'admin' 
            ? api.getRequests()
            : api.getUserRequests(Number(user.id)),
          api.getUsers()
        ]);
        
        // Debug için gelen verileri yazdıralım
        console.log('Requests:', requestsData);
        console.log('Users:', usersData);
        
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
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'admin' ? 'Tüm Talepler' : 'Taleplerim'}
      </Typography>
      {requests.length === 0 ? (
        <Typography align="center" mt={4}>
          Henüz talep bulunmamaktadır.
        </Typography>
      ) : (
        <RequestList requests={requests} users={user?.role === 'admin' ? users : undefined} />
      )}
    </Box>
  );
}; 