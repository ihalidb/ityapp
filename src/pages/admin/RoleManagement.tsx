import React, { useEffect, useState } from 'react';
import type { Role } from '../../types/index.ts';
import * as api from '../../services/api';

interface RoleFormData {
  name: string;
  code: string;
}

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({ name: '', code: '' });
  const [formError, setFormError] = useState('');

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!formData.name || !formData.code) {
        setFormError('Tüm alanlar zorunlu!');
        return;
      }
      if (selectedRole) {
        await api.updateRole(selectedRole.id, formData);
      } else {
        const maxOrder = Math.max(...roles.map(r => r.order), -1);
        await api.createRole({ ...formData, order: maxOrder + 1 });
      }
      setDialogOpen(false);
      setSelectedRole(null);
      setFormData({ name: '', code: '' });
      fetchRoles();
    } catch (err) {
      setFormError('Rol kaydedilemedi!');
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({ name: role.name, code: role.code });
    setDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.code === 'admin') {
      alert('Admin rolü silinemez!');
      return;
    }
    if (!window.confirm(`${role.name} rolünü silmek istediğinize emin misiniz?`)) return;
    try {
      await api.deleteRole(role.id);
      fetchRoles();
    } catch (err) {
      setError('Rol silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Rol Yönetimi</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { setSelectedRole(null); setFormData({ name: '', code: '' }); setDialogOpen(true); }}
        >
          Yeni Rol
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Rol Adı</th>
              <th className="px-4 py-2 text-left">Rol Kodu</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{role.id}</td>
                <td className="px-4 py-2">{role.name}</td>
                <td className="px-4 py-2">{role.code}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => handleEdit(role)}>Düzenle</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleDelete(role)} disabled={role.code === 'admin'}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Rol Dialogu */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setDialogOpen(false)} aria-label="Kapat">&times;</button>
            <h2 className="text-lg font-bold mb-4">{selectedRole ? 'Rolü Düzenle' : 'Yeni Rol Ekle'}</h2>
            {formError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2">{formError}</div>}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Rol Adı</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol Kodu</label>
                <input type="text" name="code" value={formData.code} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <div className="text-xs text-gray-500 mt-1">Örnek: mahalle_baskani (sadece küçük harf ve alt çizgi kullanın)</div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setDialogOpen(false)}>İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{selectedRole ? 'Güncelle' : 'Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 