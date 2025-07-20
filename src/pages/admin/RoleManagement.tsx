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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { Role } from '../../types/index.ts';
import * as api from '../../services/api';

interface RoleFormData {
  name: string;
  code: string;
}

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  initialData?: Partial<RoleFormData>;
  mode: 'create' | 'edit';
}

const RoleDialog = ({ open, onClose, onSubmit, initialData, mode }: RoleDialogProps) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: initialData?.name || '',
    code: initialData?.code || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
      });
    }
  }, [initialData]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.code) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // Kod formatını kontrol et
      const codeRegex = /^[a-z_]+$/;
      if (!codeRegex.test(formData.code)) {
        throw new Error('Rol kodu sadece küçük harf ve alt çizgi içerebilir');
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
          {mode === 'create' ? 'Yeni Rol Ekle' : 'Rolü Düzenle'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="dense"
            label="Rol Adı"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="Örnek: Mahalle Başkanı"
          />
          <TextField
            margin="dense"
            label="Rol Kodu"
            fullWidth
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
            helperText="Örnek: mahalle_baskani (sadece küçük harf ve alt çizgi kullanın)"
          />
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

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      setError('Roller yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Admin rolünü her zaman en alta sabitleyen yardımcı fonksiyon
  const getSortedRoles = () => {
    const adminRole = roles.find(r => r.code === 'admin');
    const otherRoles = roles.filter(r => r.code !== 'admin');
    return [...otherRoles, ...(adminRole ? [adminRole] : [])];
  };

  const handleCreateRole = async (data: RoleFormData) => {
    // Admin rolünden önce eklenebilecek son sırayı bul
    const nonAdminRoles = roles.filter(r => r.code !== 'admin');
    const maxOrder = Math.max(...nonAdminRoles.map(r => r.order), -1);
    await api.createRole({
      ...data,
      order: maxOrder + 1,
    });
    fetchRoles();
  };

  const handleUpdateRole = async (data: RoleFormData) => {
    if (!selectedRole) return;
    await api.updateRole(selectedRole.id, data);
    fetchRoles();
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.code === 'admin') {
      alert('Admin rolü silinemez!');
      return;
    }

    if (!window.confirm(`${role.name} rolünü silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await api.deleteRole(role.id);
      fetchRoles();
    } catch (error) {
      setError('Rol silinirken bir hata oluştu');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sortedRoles = getSortedRoles();
    // Admin rolünün altına bırakmayı engelle
    const adminIndex = sortedRoles.findIndex(r => r.code === 'admin');
    if (result.destination.index >= adminIndex) return;

    const items = Array.from(sortedRoles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRoles([...items]);

    try {
      await api.updateRoleOrder(items);
    } catch (error) {
      setError('Rol sırası güncellenirken bir hata oluştu');
      fetchRoles(); // Hata durumunda orijinal sıralamayı geri yükle
    }
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
        <Typography variant="h4">Rol Yönetimi</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedRole(null);
            setDialogOpen(true);
          }}
        >
          Yeni Rol
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Rol Adı</TableCell>
                <TableCell>Rol Kodu</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <Droppable droppableId="roles">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {getSortedRoles().map((role, index, arr) => (
                    <Draggable
                      key={role.id}
                      draggableId={role.id.toString()}
                      index={index}
                      isDragDisabled={role.code === 'admin'}
                    >
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit',
                          }}
                        >
                          <TableCell {...provided.dragHandleProps}>
                            <DragIndicatorIcon
                              sx={{
                                cursor: role.code === 'admin' ? 'not-allowed' : 'grab',
                                color: role.code === 'admin' ? 'action.disabled' : 'action.active',
                              }}
                            />
                          </TableCell>
                          <TableCell>{role.id}</TableCell>
                          <TableCell>{role.name}</TableCell>
                          <TableCell>{role.code}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setSelectedRole(role);
                                setDialogOpen(true);
                              }}
                              color="primary"
                              disabled={role.code === 'admin'}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteRole(role)}
                              color="error"
                              disabled={role.code === 'admin'}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </TableContainer>
      </DragDropContext>

      <RoleDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedRole(null);
        }}
        onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}
        initialData={selectedRole || undefined}
        mode={selectedRole ? 'edit' : 'create'}
      />
    </Box>
  );
}; 