import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import type { User } from '../../../shared/types';
import type { UserFormData } from '../types';

export const UserManagement: React.FC = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({ username: '', password: '', email: '', phone: '', role: '' });
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      email: user.email || '',
      phone: user.phone,
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`${user.username} isimli kullanıcıyı silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteUser(user.id);
      } catch (err) {
        // Error is handled by useAdmin hook
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowForm(false);
      setSelectedUser(null);
    } catch (err) {
      // Error is handled by useAdmin hook
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          Yeni Kullanıcı
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Kullanıcı Adı</th>
              <th className="px-4 py-2 text-left">E-posta</th>
              <th className="px-4 py-2 text-left">Telefon</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email || '-'}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 space-x-2 flex flex-row items-center justify-start">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                    onClick={() => handleEdit(user)}
                    title="Düzenle"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(user)}
                    disabled={user.role === 'admin'}
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Şifre</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!selectedUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Rol Seçin</option>
                  <option value="admin">Admin</option>
                  <option value="mahalle_baskani">Mahalle Başkanı</option>
                  <option value="meclis_uyesi">Meclis Üyesi</option>
                  <option value="yonetim_kurulu_uyesi">Yönetim Kurulu Üyesi</option>
                  <option value="yurutme_kurulu_uyesi">Yürütme Kurulu Üyesi</option>
                  <option value="ilce_baskani">İlçe Başkanı</option>
                  <option value="ozel_kalem">Özel Kalem</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  {selectedUser ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 