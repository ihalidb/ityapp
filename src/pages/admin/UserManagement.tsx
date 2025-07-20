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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { User, Role } from '../../types/index.ts';
import * as api from '../../services/api';

interface UserFormData {
  username: string;
  password: string;
  email?: string;
  phone: string;
  role: string;
}

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  mode: 'create' | 'edit';
  roles: Role[];
}

const UserDialog = ({ open, onClose, onSubmit, initialData, mode, roles }: UserDialogProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: initialData?.username || '',
    password: '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || (roles.length > 0 ? roles[0].code : ''),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        password: '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || (roles.length > 0 ? roles[0].code : ''),
      });
    } else {
      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        role: roles.length > 0 ? roles[0].code : '',
      });
    }
  }, [initialData, roles]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.username || (!mode || mode === 'create' ? !formData.password : false) || !formData.phone || !formData.role) {
        throw new Error('Lütfen zorunlu alanları doldurun');
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="dense"
            label="Kullanıcı Adı"
            fullWidth
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {mode === 'create' && (
            <TextField
              margin="dense"
              label="Şifre"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          )}
          <TextField
            margin="dense"
            label="E-posta"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              label="Rol"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.code}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {mode === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.getUsers(),
        api.getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (data: UserFormData) => {
    await api.createUser(data);
    fetchData();
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    await api.updateUser(selectedUser.id, data);
    fetchData();
  };

  const handleDeleteUser = async (user: User) => {
    if (user.role === 'admin') {
      alert('Admin kullanıcısı silinemez!');
      return;
    }

    if (!window.confirm(`${user.username} kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await api.deleteUser(user.id);
      fetchData();
    } catch (error) {
      setError('Kullanıcı silinirken bir hata oluştu');
    }
  };

  const getRoleName = (roleCode: string) => {
    const role = roles.find(r => r.code === roleCode);
    return role ? role.name : roleCode;
  };

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedUser(null);
            setDialogOpen(true);
          }}
        >
          Yeni Kullanıcı
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={getRoleName(user.role)}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setDialogOpen(true);
                    }}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user)}
                    color="error"
                    disabled={user.role === 'admin'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        initialData={selectedUser || undefined}
        mode={selectedUser ? 'edit' : 'create'}
        roles={roles}
      />
    </Box>
  );
}; 