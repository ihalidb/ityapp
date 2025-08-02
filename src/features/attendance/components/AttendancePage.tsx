import React, { useState } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useAttendanceData, type Person, type Event, type AttendanceRecord } from '../hooks/useAttendanceData';

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

const getStatusText = (status: string) => {
  switch (status) {
    case 'present': return 'Geldi';
    case 'absent': return 'Gelmedi';
    case 'late': return 'Geç Geldi';
    case 'excused': return 'Mazeretli';
    default: return 'Belirsiz';
  }
};

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { 
    persons, 
    events, 
    attendanceRecords, 
    addPerson, 
    addEvent, 
    updateAttendance, 
    getAttendanceStatus 
  } = useAttendanceData();
  
  const [selectedEvent, setSelectedEvent] = useState<number>(events.length > 0 ? events[0].id : 0);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', role: '', department: '' });
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '' });

  const handleAddPerson = () => {
    if (newPerson.name && newPerson.role && newPerson.department) {
      addPerson(newPerson);
      setNewPerson({ name: '', role: '', department: '' });
      setShowAddPersonModal(false);
    }
  };

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.location) {
      addEvent(newEvent);
      setNewEvent({ name: '', date: '', location: '' });
      setShowAddEventModal(false);
    }
  };

  const handleAttendanceChange = (personId: number, eventId: number, status: AttendanceRecord['status']) => {
    updateAttendance(personId, eventId, status);
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Yoklama Listesi</h1>
        <p className="text-gray-600">Etkinliklere katılım durumlarının takibi</p>
      </div>

      {/* Event Selection and Add Buttons */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Seçin</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
          >
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} - {new Date(event.date).toLocaleDateString('tr-TR')}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setShowAddEventModal(true)}
          className="px-4 py-2 bg-[#00488E] text-white rounded-lg hover:bg-[#003366] transition-colors"
        >
          Etkinlik Ekle
        </button>
        
        <button
          onClick={() => setShowAddPersonModal(true)}
          className="px-4 py-2 bg-[#F49B00] text-white rounded-lg hover:bg-[#E08A00] transition-colors"
        >
          Kişi Ekle
        </button>
      </div>

      {/* Event Details */}
      {selectedEventData && (
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{selectedEventData.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Tarih:</span> {new Date(selectedEventData.date).toLocaleDateString('tr-TR')}
            </div>
            <div>
              <span className="font-medium">Yer:</span> {selectedEventData.location}
            </div>
          </div>
        </div>
      )}

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

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kişi Bilgileri
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Katılım Durumu
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {persons.map((person) => {
                const currentStatus = getAttendanceStatus(person.id, selectedEvent);
                return (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.role}</div>
                        <div className="text-xs text-gray-400">{person.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
                        {getStatusText(currentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleAttendanceChange(person.id, selectedEvent, e.target.value as AttendanceRecord['status'])}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
                      >
                        <option value="present">Geldi</option>
                        <option value="absent">Gelmedi</option>
                        <option value="late">Geç Geldi</option>
                        <option value="excused">Mazeretli</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {persons.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kişi bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Henüz hiç kişi eklenmemiş.</p>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPersonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Yeni Kişi Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <input
                  type="text"
                  value={newPerson.role}
                  onChange={(e) => setNewPerson({...newPerson, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                  placeholder="Rol"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                <input
                  type="text"
                  value={newPerson.department}
                  onChange={(e) => setNewPerson({...newPerson, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                  placeholder="Departman"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddPersonModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={handleAddPerson}
                className="px-4 py-2 bg-[#00488E] text-white rounded-lg hover:bg-[#003366]"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Yeni Etkinlik Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                  placeholder="Etkinlik Adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yer</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E]"
                  placeholder="Yer"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-[#00488E] text-white rounded-lg hover:bg-[#003366]"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 