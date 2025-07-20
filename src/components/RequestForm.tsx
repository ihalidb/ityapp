import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { Request, Department } from '../types/index.ts';
import * as api from '../services/api';

const schema = yup.object().shape({
  title: yup.string().required('Başlık gerekli'),
  department: yup.string().required('Departman seçimi gerekli'),
  description: yup.string().required('Açıklama gerekli'),
});

type RequestFormData = Omit<Request, 'id' | 'status' | 'userId' | 'createdAt'>;

interface RequestFormProps {
  onSubmit: (data: RequestFormData) => Promise<void>;
  initialData?: Partial<RequestFormData>;
}

export const RequestForm = ({ onSubmit, initialData }: RequestFormProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await api.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Talep Formu
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Başlık"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <FormControl fullWidth margin="normal" error={!!errors.department}>
        <InputLabel>Departman</InputLabel>
        <Select
          label="Departman"
          {...register('department')}
          defaultValue=""
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.name}>
              {dept.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        fullWidth
        label="Açıklama"
        multiline
        rows={4}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {initialData ? 'Güncelle' : 'Oluştur'}
      </Button>
    </Box>
  );
}; 