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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useState } from 'react';
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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const getUserName = (userId: number) => {
    if (!users) return userId.toString();
    // Debug için kullanıcı listesini ve aranan ID'yi konsola yazdıralım
    console.log('Users:', users);
    console.log('Looking for userId:', userId);
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  return (
    <>
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
                hover
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                onClick={() => setSelectedRequest(request)}
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
      {/* Detay Dialog */}
      <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Talep Detayı</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box>
              <Typography variant="subtitle1" gutterBottom><b>Başlık:</b> {selectedRequest.title}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Açıklama:</b> {selectedRequest.description}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Departman:</b> {selectedRequest.department}</Typography>
              <Typography variant="subtitle1" gutterBottom><b>Durum:</b> {selectedRequest.status}</Typography>
              {users && (
                <Typography variant="subtitle1" gutterBottom><b>Oluşturan:</b> {getUserName(selectedRequest.userId)}</Typography>
              )}
              <Typography variant="subtitle1" gutterBottom><b>Oluşturulma Tarihi:</b> {new Date(selectedRequest.createdAt).toLocaleDateString('tr-TR')} {selectedRequest.createdTime}</Typography>
              {selectedRequest.statusUpdatedAt && (
                <Typography variant="subtitle1" gutterBottom><b>Son Durum Tarihi:</b> {new Date(selectedRequest.statusUpdatedAt).toLocaleDateString('tr-TR')}</Typography>
              )}
              {selectedRequest.statusNote && (
                <Typography variant="subtitle1" gutterBottom><b>Not:</b> {selectedRequest.statusNote}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)} variant="contained">Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 