import React from 'react';
import type { Request, User } from '../types/index.ts';

interface RequestListProps {
  requests: Request[];
  users?: User[];
}

export const RequestList = ({ requests, users }: RequestListProps) => {
  const getUserName = (userId: number) => {
    if (!users) return userId.toString();
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  return (
    <div className="overflow-x-auto pb-4 rounded shadow bg-white">
      <table className="w-full sm:min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">ID</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Başlık</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Departman</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Durum</th>
            {users && <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Oluşturan</th>}
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Tarih</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Saat</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-blue-50 border-b">
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{request.id}</td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{request.title}</td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{request.department}</td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                  request.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : request.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </span>
              </td>
              {users && <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{getUserName(request.userId)}</td>}
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{new Date(request.createdAt).toLocaleDateString('tr-TR')}</td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{request.createdTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 