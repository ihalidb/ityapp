export interface Request {
  id: number | string;
  title: string;
  department: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  userId: number;
  createdAt: string;
  createdTime: string;
  statusUpdatedAt: string | null;
  statusUpdatedBy: number | null;
  statusNote: string | null;
}

export interface RequestFormData {
  title: string;
  department: string;
  description: string;
}

export interface RequestState {
  requests: Request[];
  loading: boolean;
  error: string | null;
  selectedRequest: Request | null;
} 