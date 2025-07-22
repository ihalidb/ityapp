import React, { useEffect, useState } from 'react';
import type { Request, User } from '../../types/index.ts';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const RequestManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [requestsData, usersData] = await Promise.all([
        api.getRequests(),
        api.getUsers()
      ]);
      setRequests(requestsData);
      setUsers(usersData);
    } catch (error) {
      setError('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = (request: Request, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogAction(action);
    setStatusNote('');
  };

  const handleStatusUpdateConfirm = async () => {
    if (!selectedRequest || !user || !dialogAction) return;
    try {
      const newStatus = dialogAction === 'approve' ? 'completed' : 'rejected';
      await api.updateRequest(selectedRequest.id, {
        status: newStatus,
        statusUpdatedAt: new Date().toISOString(),
        statusUpdatedBy: user.id,
        statusNote,
      });
      fetchData();
    } catch (error) {
      setError('Talep güncellenirken bir hata oluştu');
    } finally {
      setSelectedRequest(null);
      setDialogAction(null);
      setStatusNote('');
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => Number(u.id) === Number(userId));
    return user ? user.username : 'Bilinmeyen Kullanıcı';
  };

  if (loading) {
    return <div className="text-center mt-8">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Talep Yönetimi</h2>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Başlık</th>
              <th className="px-4 py-2 text-left">Departman</th>
              <th className="px-4 py-2 text-left">Durum</th>
              <th className="px-4 py-2 text-left">Oluşturan</th>
              <th className="px-4 py-2 text-left">Tarih</th>
              <th className="px-4 py-2 text-left">Saat</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{request.id}</td>
                <td className="px-4 py-2">{request.title}</td>
                <td className="px-4 py-2">{request.department}</td>
                <td className="px-4 py-2">
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
                <td className="px-4 py-2">{getUserName(request.userId)}</td>
                <td className="px-4 py-2">{new Date(request.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="px-4 py-2">{request.createdTime}</td>
                <td className="px-4 py-2 space-x-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => handleStatusUpdate(request, 'approve')}
                      >Onayla</button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        onClick={() => handleStatusUpdate(request, 'reject')}
                      >Reddet</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Durum Güncelleme Dialogu */}
      {selectedRequest && dialogAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => { setSelectedRequest(null); setDialogAction(null); }} aria-label="Kapat">&times;</button>
            <h2 className="text-lg font-bold mb-4">{dialogAction === 'approve' ? 'Talebi Onayla' : 'Talebi Reddet'}</h2>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Not"
              rows={3}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setSelectedRequest(null); setDialogAction(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">İptal</button>
              <button
                onClick={handleStatusUpdateConfirm}
                className={`px-4 py-2 rounded text-white ${dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition`}
              >
                {dialogAction === 'approve' ? 'Onayla' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 