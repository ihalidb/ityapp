import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import type { Role, PageKey } from '../../../shared/types';
import type { RoleFormData } from '../types';
import { PAGE_DEFINITIONS } from '../../../shared/types';

export const RoleManagement: React.FC = () => {
  const { roles, loading, error, createRole, updateRole, deleteRole } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    code: '',
    order: 1,
    allowedPages: []
  });

  const handleAdd = () => {
    setSelectedRole(null);
    setFormData({ name: '', code: '', order: 1, allowedPages: [] });
    setShowForm(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      order: role.order,
      allowedPages: role.allowedPages
    });
    setShowForm(true);
  };

  const handleDelete = async (role: Role) => {
    if (window.confirm(`${role.name} isimli rolü silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteRole(role.id);
      } catch (err) {
        // Error is handled by useAdmin hook
      }
    }
  };

  const handlePagePermissionChange = async (role: Role, page: string, checked: boolean) => {
    const newAllowedPages = checked
      ? Array.from(new Set([...role.allowedPages, page as PageKey]))
      : role.allowedPages.filter(p => p !== page);
    
    try {
      await updateRole(role.id, { allowedPages: newAllowedPages });
    } catch (err) {
      // Error is handled by useAdmin hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, formData);
      } else {
        await createRole(formData);
      }
      setShowForm(false);
      setSelectedRole(null);
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
        <h2 className="text-2xl font-bold">Rol Yönetim ve Yetkilendirme</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          Yeni Rol
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
              <th className="px-4 py-2 text-left">Rol Adı</th>
              {PAGE_DEFINITIONS.map(page => (
                <th key={page.key} className="px-4 py-2 text-center whitespace-nowrap">{page.label}</th>
              ))}
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{role.id}</td>
                <td className="px-4 py-2">{role.name}</td>
                {PAGE_DEFINITIONS.map(page => (
                  <td key={page.key} className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={role.allowedPages?.includes(page.key) || false}
                      onChange={e => handlePagePermissionChange(role, page.key, e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                      disabled={role.code === 'admin'}
                    />
                  </td>
                ))}
                <td className="px-4 py-2 space-x-2 flex flex-row items-center justify-start">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleEdit(role)}
                    disabled={role.code === 'admin'}
                    title="Düzenle"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(role)}
                    disabled={role.code === 'admin'}
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
              {selectedRole ? 'Rol Düzenle' : 'Yeni Rol'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rol Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol Kodu</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sıra</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  {selectedRole ? 'Güncelle' : 'Ekle'}
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