import React, { useState, useEffect } from 'react';
import type { Organization, OrganizationFormData } from '../types';
import type { Role } from '../../../shared/types';
import { authService } from '../../auth/services/authService';

interface OrganizationFormProps {
  onSubmit: (data: OrganizationFormData) => void;
  onCancel: () => void;
  initialData?: Organization;
  loading?: boolean;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: initialData?.name || '',
    position: initialData?.position || '',
    photo: initialData?.photo || '',
    order: initialData?.order || 1
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await authService.getRoles();
        setRoles(data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">
          {initialData ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ad Soyad</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Görev</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Görev Seçin</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fotoğraf URL (Opsiyonel)</label>
            <input
              type="text"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/photo.jpg (boş bırakılabilir)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sıra</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : (initialData ? 'Güncelle' : 'Ekle')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 