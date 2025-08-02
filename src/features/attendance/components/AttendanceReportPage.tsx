import React, { useState } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useAttendanceData, type Person, type Event, type AttendanceRecord } from '../hooks/useAttendanceData';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'present': return 'bg-green-500';
    case 'absent': return 'bg-red-500';
    case 'late': return 'bg-yellow-500';
    case 'excused': return 'bg-blue-500';
    default: return 'bg-gray-500';
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

export const AttendanceReportPage: React.FC = () => {
  const { user } = useAuth();
  const { persons, events, attendanceRecords } = useAttendanceData();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [reportType, setReportType] = useState<'event' | 'dateRange'>('event');

  // Rapor 1: Etkinlik bazlı katılım oranları
  const getEventAttendanceReport = () => {
    if (!selectedEvent) return null;
    
    const eventRecords = attendanceRecords.filter(record => record.eventId === selectedEvent);
    const totalPeople = persons.length;
    const presentCount = eventRecords.filter(record => record.status === 'present').length;
    const absentCount = eventRecords.filter(record => record.status === 'absent').length;
    const lateCount = eventRecords.filter(record => record.status === 'late').length;
    const excusedCount = eventRecords.filter(record => record.status === 'excused').length;
    
    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      total: totalPeople,
      attendanceRate: totalPeople > 0 ? ((presentCount + lateCount) / totalPeople * 100).toFixed(1) : '0.0'
    };
  };

  // Rapor 2: Tarih aralığı bazlı katılım oranları
  const getDateRangeAttendanceReport = () => {
    const filteredEvents = events.filter(event => 
      event.date >= dateRange.start && event.date <= dateRange.end
    );
    
    const eventIds = filteredEvents.map(event => event.id);
    const filteredRecords = attendanceRecords.filter(record => eventIds.includes(record.eventId));
    
    const totalPeople = persons.length;
    const totalEvents = filteredEvents.length;
    const totalPossibleAttendances = totalPeople * totalEvents;
    
    const presentCount = filteredRecords.filter(record => record.status === 'present').length;
    const absentCount = filteredRecords.filter(record => record.status === 'absent').length;
    const lateCount = filteredRecords.filter(record => record.status === 'late').length;
    const excusedCount = filteredRecords.filter(record => record.status === 'excused').length;
    
    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      totalEvents,
      totalPossibleAttendances,
      attendanceRate: totalPossibleAttendances > 0 ? ((presentCount + lateCount) / totalPossibleAttendances * 100).toFixed(1) : '0.0'
    };
  };

  // Rapor 3: Kişi bazlı katılım performansı
  const getPersonPerformanceReport = () => {
    const personStats = persons.map(person => {
      const personRecords = attendanceRecords.filter(record => record.personId === person.id);
      const totalEvents = events.length;
      const presentCount = personRecords.filter(record => record.status === 'present').length;
      const absentCount = personRecords.filter(record => record.status === 'absent').length;
      const lateCount = personRecords.filter(record => record.status === 'late').length;
      const excusedCount = personRecords.filter(record => record.status === 'excused').length;
      
      return {
        person,
        totalEvents,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendanceRate: totalEvents > 0 ? ((presentCount + lateCount) / totalEvents * 100).toFixed(1) : '0.0'
      };
    });
    
    return personStats.sort((a, b) => parseFloat(b.attendanceRate) - parseFloat(a.attendanceRate));
  };

  // Rapor 4: Departman bazlı katılım analizi
  const getDepartmentReport = () => {
    const departments = [...new Set(persons.map(person => person.department))];
    
    return departments.map(department => {
      const departmentPersons = persons.filter(person => person.department === department);
      const departmentPersonIds = departmentPersons.map(person => person.id);
      const departmentRecords = attendanceRecords.filter(record => 
        departmentPersonIds.includes(record.personId)
      );
      
      const totalEvents = events.length;
      const totalPossibleAttendances = departmentPersons.length * totalEvents;
      const presentCount = departmentRecords.filter(record => record.status === 'present').length;
      const absentCount = departmentRecords.filter(record => record.status === 'absent').length;
      const lateCount = departmentRecords.filter(record => record.status === 'late').length;
      const excusedCount = departmentRecords.filter(record => record.status === 'excused').length;
      
      return {
        department,
        personCount: departmentPersons.length,
        totalEvents,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendanceRate: totalPossibleAttendances > 0 ? ((presentCount + lateCount) / totalPossibleAttendances * 100).toFixed(1) : '0.0'
      };
    }).sort((a, b) => parseFloat(b.attendanceRate) - parseFloat(a.attendanceRate));
  };

  const currentReport = reportType === 'event' ? getEventAttendanceReport() : getDateRangeAttendanceReport();
  const personPerformance = getPersonPerformanceReport();
  const departmentReport = getDepartmentReport();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Yoklama Raporu</h1>
        <p className="text-gray-600">Etkinlik ve katılım durumlarının detaylı analizi</p>
      </div>

      {/* Report Type Selection */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="event"
              checked={reportType === 'event'}
              onChange={(e) => setReportType(e.target.value as 'event' | 'dateRange')}
              className="mr-2"
            />
            Etkinlik Bazlı Rapor
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="dateRange"
              checked={reportType === 'dateRange'}
              onChange={(e) => setReportType(e.target.value as 'event' | 'dateRange')}
              className="mr-2"
            />
            Tarih Aralığı Raporu
          </label>
        </div>
      </div>

      {/* Event Selection or Date Range */}
      {reportType === 'event' ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Seçin</label>
          <select
            value={selectedEvent || ''}
            onChange={(e) => setSelectedEvent(e.target.value ? Number(e.target.value) : null)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
          >
            <option value="">Etkinlik seçin</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} - {new Date(event.date).toLocaleDateString('tr-TR')}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00488E] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Report 1: Attendance Overview Chart */}
      {currentReport && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {reportType === 'event' ? 'Etkinlik Katılım Oranları' : 'Tarih Aralığı Katılım Oranları'}
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{currentReport.present}</div>
                <div className="text-sm text-gray-600">Geldi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{currentReport.absent}</div>
                <div className="text-sm text-gray-600">Gelmedi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{currentReport.late}</div>
                <div className="text-sm text-gray-600">Geç Geldi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{currentReport.excused}</div>
                <div className="text-sm text-gray-600">Mazeretli</div>
              </div>
            </div>
            
            {/* Pie Chart */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {currentReport.present > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${(currentReport.present / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {currentReport.absent > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="8"
                      strokeDasharray={`${(currentReport.absent / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 251.2} 251.2`}
                      transform={`rotate(${-90 + (currentReport.present / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 360} 50 50)`}
                    />
                  )}
                  {currentReport.late > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${(currentReport.late / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 251.2} 251.2`}
                      transform={`rotate(${-90 + ((currentReport.present + currentReport.absent) / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 360} 50 50)`}
                    />
                  )}
                  {currentReport.excused > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(currentReport.excused / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 251.2} 251.2`}
                      transform={`rotate(${-90 + ((currentReport.present + currentReport.absent + currentReport.late) / (currentReport.present + currentReport.absent + currentReport.late + currentReport.excused)) * 360} 50 50)`}
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{currentReport.attendanceRate}%</div>
                    <div className="text-sm text-gray-600">Katılım Oranı</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Person Performance Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kişi Bazlı Performans</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {personPerformance.length > 0 ? (
            <div className="space-y-4">
              {personPerformance.map((person, index) => (
                <div key={person.person.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#00488E] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{person.person.name}</div>
                      <div className="text-sm text-gray-600">{person.person.role} - {person.person.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{person.attendanceRate}%</div>
                      <div className="text-sm text-gray-600">Katılım Oranı</div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#00488E] h-2 rounded-full"
                        style={{ width: `${person.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz kişi bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report 3: Department Performance Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Departman Bazlı Analiz</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {departmentReport.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentReport.map((dept, index) => (
                <div key={dept.department} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                    <div className="text-sm text-gray-600">{dept.personCount} kişi</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Katılım Oranı:</span>
                      <span className="font-medium">{dept.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#00488E] h-2 rounded-full"
                        style={{ width: `${dept.attendanceRate}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Geldi: {dept.presentCount}</div>
                      <div>Gelmedi: {dept.absentCount}</div>
                      <div>Geç: {dept.lateCount}</div>
                      <div>Mazeret: {dept.excusedCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz departman bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report 4: Monthly Trend Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aylık Katılım Trendi</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-64 flex items-end justify-center space-x-2">
            {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'].map((month, index) => {
              const monthEvents = events.filter(event => {
                const eventMonth = new Date(event.date).getMonth();
                return eventMonth === index;
              });
              
              const monthRecords = attendanceRecords.filter(record => 
                monthEvents.some(event => event.id === record.eventId)
              );
              
              const totalPossible = persons.length * monthEvents.length;
              const presentCount = monthRecords.filter(record => record.status === 'present').length;
              const lateCount = monthRecords.filter(record => record.status === 'late').length;
              const attendanceRate = totalPossible > 0 ? ((presentCount + lateCount) / totalPossible * 100) : 0;
              
              return (
                <div key={month} className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2">{month}</div>
                  <div
                    className="bg-[#00488E] rounded-t"
                    style={{ 
                      width: '40px', 
                      height: `${Math.max(20, attendanceRate * 2)}px` 
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{attendanceRate.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 