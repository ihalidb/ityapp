import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import type { Request, User } from '../../types/index.ts';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  action: 'approve' | 'reject' | null;
}

const StatusUpdateDialog = ({ open, onClose, onConfirm, action }: StatusUpdateDialogProps) => {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(note);
    setNote('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {action === 'approve' ? 'Talebi Onayla' : 'Talebi Reddet'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Not"
          fullWidth
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleConfirm} variant="contained" color={action === 'approve' ? 'success' : 'error'}>
          {action === 'approve' ? 'Onayla' : 'Reddet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RequestManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [requestsData, usersData] = await Promise.all([
        api.getRequests(),
        api.getUsers()
      ]);
      setRequests(requestsData);
      setUsers(usersData);
    } catch (error) {
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (request: Request, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogAction(action);
  };

  const handleStatusUpdateConfirm = async (note: string) => {
    if (!selectedRequest || !user || !dialogAction) return;

    try {
      const newStatus = dialogAction === 'approve' ? 'completed' : 'rejected';
      await api.updateRequest(selectedRequest.id, {
        status: newStatus,
        statusUpdatedAt: new Date().toISOString(),
        statusUpdatedBy: user.id,
        statusNote: note,
      });
      fetchData();
    } catch (error) {
      setError('Talep güncellenirken bir hata oluştu');
    } finally {
      setSelectedRequest(null);
      setDialogAction(null);
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Talep Yönetimi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell>Departman</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Oluşturan</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Saat</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={
                      request.status === 'completed'
                        ? 'success'
                        : request.status === 'rejected'
                        ? 'error'
                        : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{getUserName(request.userId)}</TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>{request.createdTime}</TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <Box>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(request, 'approve')}
                        sx={{ mr: 1 }}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusUpdate(request, 'reject')}
                      >
                        Reddet
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StatusUpdateDialog
        open={!!selectedRequest && !!dialogAction}
        onClose={() => {
          setSelectedRequest(null);
          setDialogAction(null);
        }}
        onConfirm={handleStatusUpdateConfirm}
        action={dialogAction}
      />
    </Box>
  );
}; 