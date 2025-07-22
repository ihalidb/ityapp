import React, { useEffect, useState } from 'react';
import type { User, Role } from '../../types/index.ts';
import * as api from '../../services/api';

interface UserFormData {
  username: string;
  password: string;
  email?: string;
  phone: string;
  role: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ username: '', password: '', email: '', phone: '', role: '' });
  const [formError, setFormError] = useState('');

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (!formData.username || (!selectedUser && !formData.password) || !formData.phone || !formData.role) {
        setFormError('Tüm alanlar zorunlu!');
        return;
      }
      if (selectedUser) {
        await api.updateUser(selectedUser.id, formData);
      } else {
        await api.createUser(formData);
      }
      setDialogOpen(false);
      setSelectedUser(null);
      setFormData({ username: '', password: '', email: '', phone: '', role: roles[0]?.code || '' });
      fetchData();
    } catch (err) {
      setFormError('Kullanıcı kaydedilemedi!');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ username: user.username, password: '', email: user.email || '', phone: user.phone, role: user.role });
    setDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (user.role === 'admin') {
      alert('Admin kullanıcısı silinemez!');
      return;
    }
    if (!window.confirm(`${user.username} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try {
      await api.deleteUser(user.id);
      fetchData();
    } catch (err) {
      setError('Kullanıcı silinirken bir hata oluştu');
    }
  };

  const getRoleName = (roleCode: string) => {
    const role = roles.find(r => r.code === roleCode);
    return role ? role.name : roleCode;
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
        <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { setSelectedUser(null); setFormData({ username: '', password: '', email: '', phone: '', role: roles[0]?.code || '' }); setDialogOpen(true); }}
        >
          Yeni Kullanıcı
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Kullanıcı Adı</th>
              <th className="px-4 py-2 text-left">Telefon</th>
              <th className="px-4 py-2 text-left">E-posta</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.email || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{getRoleName(user.role)}</span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => handleEdit(user)}>Düzenle</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleDelete(user)} disabled={user.role === 'admin'}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Kullanıcı Dialogu */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setDialogOpen(false)} aria-label="Kapat">&times;</button>
            <h2 className="text-lg font-bold mb-4">{selectedUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h2>
            {formError && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2">{formError}</div>}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              {!selectedUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Şifre</label>
                  <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select name="role" value={formData.role} onChange={handleFormChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  {roles.map((role) => (
                    <option key={role.id} value={role.code}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setDialogOpen(false)}>İptal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{selectedUser ? 'Güncelle' : 'Oluştur'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 