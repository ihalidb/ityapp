import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { requestService } from '../services/requestService';
import type { RequestFormData } from '../types';
import type { Department } from '../../../shared/types';

const schema = yup.object().shape({
  title: yup.string().required('Başlık gerekli'),
  department: yup.string().required('Departman seçimi gerekli'),
  description: yup.string().required('Açıklama gerekli'),
});

interface RequestFormProps {
  onSubmit: (data: RequestFormData) => void;
  initialData?: Partial<RequestFormData>;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, initialData }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptOpen, setDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>(initialData?.department || '');
  const deptButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await requestService.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    setValue('department', selectedDept);
  }, [selectedDept, setValue]);

  const handleDeptKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDeptOpen(true);
    } else if (e.key === 'Escape') {
      setDeptOpen(false);
    }
  };

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
        <div className="relative">
          <button
            type="button"
            ref={deptButtonRef}
            className={`w-full border ${errors.department ? 'border-red-400' : 'border-gray-300'} rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white`}
            onClick={() => setDeptOpen((v) => !v)}
            onKeyDown={handleDeptKeyDown}
            aria-haspopup="listbox"
            aria-expanded={deptOpen}
            aria-labelledby="department-label"
          >
            <span className={selectedDept ? '' : 'text-gray-400'}>{selectedDept || 'Departman Seçin'}</span>
            <svg className={`w-5 h-5 ml-2 transition-transform ${deptOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {deptOpen && (
            <ul
              tabIndex={-1}
              className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-auto animate-fade-in"
              role="listbox"
              aria-labelledby="department-label"
            >
              {departments.map((dept) => (
                <li
                  key={dept.id}
                  role="option"
                  aria-selected={selectedDept === dept.name}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${selectedDept === dept.name ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                  onClick={() => { setSelectedDept(dept.name); setDeptOpen(false); deptButtonRef.current?.focus(); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedDept(dept.name); setDeptOpen(false); deptButtonRef.current?.focus();
                    }
                  }}
                >
                  {dept.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input type="hidden" {...register('department')} value={selectedDept} />
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