import React from 'react';
import type { Request } from '../types';
import type { User } from '../../../shared/types';

interface RequestListProps {
  requests: Request[];
  users?: User[];
}

export const RequestList: React.FC<RequestListProps> = ({ requests, users }) => {
  const getUserName = (userId: number) => {
    if (!users) return userId.toString();
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">Tamamlandı</span>;
      case 'rejected':
        return <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-red-100 text-red-800">Reddedildi</span>;
      case 'in-progress':
        return <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800">Devam Ediyor</span>;
      default:
        return <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800">Beklemede</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="relative">
      {/* Scroll indicator for mobile */}
      <div className="sm:hidden mb-2 text-center">
        <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-xs text-gray-600">Sağa kaydırın</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">ID</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Başlık</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Departman</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Durum</th>
              {users && <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Oluşturan</th>}
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Tarih</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">Saat</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request.id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{request.id}</td>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap max-w-[180px] truncate text-xs sm:text-sm" title={request.title}>{request.title}</td>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{request.department}</td>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap">{statusBadge(request.status)}</td>
                {users && <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{getUserName(request.userId)}</td>}
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{formatDate(request.createdAt)}</td>
                <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">{request.createdTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 