import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Request, Department } from '../types/index.ts';
import * as api from '../services/api';

const schema = yup.object().shape({
  title: yup.string().required('Başlık gerekli'),
  department: yup.string().required('Departman seçimi gerekli'),
  description: yup.string().required('Açıklama gerekli'),
});

type RequestFormData = Omit<Request, 'id' | 'status' | 'userId' | 'createdAt'>;

interface RequestFormProps {
  onSubmit: (data: RequestFormData) => void;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input
          type="text"
          {...register('title')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.title && <div className="text-xs text-red-600 mt-1">{errors.title.message}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Departman</label>
        <select
          {...register('department')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Departman Seçin</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        {errors.department && <div className="text-xs text-red-600 mt-1">{errors.department.message}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Açıklama</label>
        <textarea
          {...register('description')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
        {errors.description && <div className="text-xs text-red-600 mt-1">{errors.description.message}</div>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {initialData ? 'Güncelle' : 'Oluştur'}
      </button>
    </form>
  );
}; 