import { useState, useEffect } from 'react';

export interface Person {
  id: number;
  name: string;
  role: string;
  department: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
}

export interface AttendanceRecord {
  id: number;
  personId: number;
  eventId: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

// Mock veriler - gerçek uygulamada API'den gelecek
const mockPersons: Person[] = [
  { id: 1, name: 'Ahmet Yılmaz', role: 'Mahalle Başkanı', department: 'Yönetim' },
  { id: 2, name: 'Fatma Demir', role: 'Meclis Üyesi', department: 'Meclis' },
  { id: 3, name: 'Mehmet Kaya', role: 'Yönetim Kurulu Üyesi', department: 'Yönetim' },
  { id: 4, name: 'Ayşe Özkan', role: 'Sekreter', department: 'Sekreterya' },
  { id: 5, name: 'Ali Çelik', role: 'İlçe Başkanı', department: 'Yönetim' }
];

const mockEvents: Event[] = [
  { id: 1, name: 'Aylık Yönetim Kurulu Toplantısı', date: '2024-01-15', location: 'Merkez Ofis' },
  { id: 2, name: 'Genel Kurul Toplantısı', date: '2024-01-20', location: 'Kongre Merkezi' },
  { id: 3, name: 'Komisyon Toplantısı', date: '2024-01-25', location: 'Toplantı Salonu' },
  { id: 4, name: 'Eğitim Semineri', date: '2024-02-01', location: 'Eğitim Salonu' },
  { id: 5, name: 'Strateji Toplantısı', date: '2024-02-10', location: 'Konferans Salonu' }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 1, personId: 1, eventId: 1, status: 'present' },
  { id: 2, personId: 2, eventId: 1, status: 'absent' },
  { id: 3, personId: 3, eventId: 1, status: 'late' },
  { id: 4, personId: 4, eventId: 1, status: 'present' },
  { id: 5, personId: 5, eventId: 1, status: 'excused' },
  { id: 6, personId: 1, eventId: 2, status: 'present' },
  { id: 7, personId: 2, eventId: 2, status: 'present' },
  { id: 8, personId: 3, eventId: 2, status: 'absent' },
  { id: 9, personId: 4, eventId: 2, status: 'late' },
  { id: 10, personId: 5, eventId: 2, status: 'present' },
  { id: 11, personId: 1, eventId: 3, status: 'present' },
  { id: 12, personId: 2, eventId: 3, status: 'present' },
  { id: 13, personId: 3, eventId: 3, status: 'present' },
  { id: 14, personId: 4, eventId: 3, status: 'absent' },
  { id: 15, personId: 5, eventId: 3, status: 'excused' }
];

export const useAttendanceData = () => {
  const [persons, setPersons] = useState<Person[]>(mockPersons);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  const addPerson = (person: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...person,
      id: Math.max(...persons.map(p => p.id)) + 1
    };
    setPersons(prev => [...prev, newPerson]);
    return newPerson;
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Math.max(...events.map(e => e.id)) + 1
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateAttendance = (personId: number, eventId: number, status: AttendanceRecord['status']) => {
    const existingRecord = attendanceRecords.find(record => 
      record.personId === personId && record.eventId === eventId
    );

    if (existingRecord) {
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.id === existingRecord.id ? { ...record, status } : record
        )
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.max(...attendanceRecords.map(r => r.id)) + 1,
        personId,
        eventId,
        status
      };
      setAttendanceRecords(prev => [...prev, newRecord]);
    }
  };

  const getAttendanceStatus = (personId: number, eventId: number) => {
    const record = attendanceRecords.find(r => r.personId === personId && r.eventId === eventId);
    return record?.status || 'absent';
  };

  return {
    persons,
    events,
    attendanceRecords,
    addPerson,
    addEvent,
    updateAttendance,
    getAttendanceStatus
  };
}; 