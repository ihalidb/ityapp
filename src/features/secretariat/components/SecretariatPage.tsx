import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface SecretariatItem {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  dueDate?: string;
}

const mockSecretariatData: SecretariatItem[] = [
  {
    id: 1,
    title: 'Toplantı Tutanağı Hazırlama',
    description: 'Aylık yönetim kurulu toplantısı tutanağının hazırlanması',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Ahmet Yılmaz',
    createdAt: '2024-01-15',
    dueDate: '2024-01-20'
  },
  {
    id: 2,
    title: 'Evrak Arşivleme',
    description: 'Gelen ve giden evrakların dijital arşivlenmesi',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Fatma Demir',
    createdAt: '2024-01-10',
    dueDate: '2024-01-12'
  },
  {
    id: 3,
    title: 'Protokol Yazışmaları',
    description: 'Resmi kurumlarla protokol yazışmalarının takibi',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Mehmet Kaya',
    createdAt: '2024-01-14'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-orange-100 text-orange-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const SecretariatPage: React.FC = () => {
  const { user } = useAuth();
  const [secretariatItems, setSecretariatItems] = useState<SecretariatItem[]>(mockSecretariatData);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredItems = secretariatItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  const handleStatusChange = (id: number, newStatus: SecretariatItem['status']) => {
    setSecretariatItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sekreterya İşleri</h1>
        <p className="text-gray-600">Sekreterya işlerinin takibi ve yönetimi</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-[#00488E] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tümü ({secretariatItems.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-[#00488E] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bekleyen ({secretariatItems.filter(item => item.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'in-progress' 
              ? 'bg-[#00488E] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Devam Eden ({secretariatItems.filter(item => item.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed' 
              ? 'bg-[#00488E] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tamamlanan ({secretariatItems.filter(item => item.status === 'completed').length})
        </button>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="mb-4 lg:hidden">
        <div className="bg-[#00488E] text-white px-4 py-2 rounded-full text-sm flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Sağa kaydırın</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Secretariat Items Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İş Başlığı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öncelik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atanan Kişi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'pending' && 'Bekliyor'}
                      {item.status === 'in-progress' && 'Devam Ediyor'}
                      {item.status === 'completed' && 'Tamamlandı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority === 'high' && 'Yüksek'}
                      {item.priority === 'medium' && 'Orta'}
                      {item.priority === 'low' && 'Düşük'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as SecretariatItem['status'])}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
                    >
                      <option value="pending">Bekliyor</option>
                      <option value="in-progress">Devam Ediyor</option>
                      <option value="completed">Tamamlandı</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sekreterya işi bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Seçilen filtrelere uygun sekreterya işi yok.</p>
        </div>
      )}
    </div>
  );
}; 