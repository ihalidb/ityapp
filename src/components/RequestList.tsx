import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Request, User } from '../types/index.ts';

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  rejected: 'error',
} as const;

interface RequestListProps {
  requests: Request[];
  users?: User[];
}

export const RequestList = ({ requests, users }: RequestListProps) => {
  const getUserName = (userId: number) => {
    if (!users) return userId.toString();
    // Debug için kullanıcı listesini ve aranan ID'yi konsola yazdıralım
    console.log('Users:', users);
    console.log('Looking for userId:', userId);
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Başlık</TableCell>
            <TableCell>Departman</TableCell>
            <TableCell>Durum</TableCell>
            {users && <TableCell>Oluşturan</TableCell>}
            <TableCell>Tarih</TableCell>
            <TableCell>Saat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              component={RouterLink}
              to={`/requests/${request.id}`}
              sx={{
                textDecoration: 'none',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.title}</TableCell>
              <TableCell>{request.department}</TableCell>
              <TableCell>
                <Chip
                  label={request.status}
                  color={statusColors[request.status]}
                  size="small"
                />
              </TableCell>
              {users && <TableCell>{getUserName(request.userId)}</TableCell>}
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString('tr-TR')}
              </TableCell>
              <TableCell>{request.createdTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 