export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  phone: string;
  role: string;
}

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

export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  order: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const USER_ROLES = {
  admin: 'Yönetici',
  mahalle_baskani: 'Mahalle Başkanı',
  meclis_uyesi: 'Meclis Üyesi',
  yonetim_kurulu_uyesi: 'Yönetim Kurulu Üyesi',
  yurutme_kurulu_uyesi: 'Yürütme Kurulu Üyesi',
  ilce_baskani: 'İlçe Başkanı',
  ozel_kalem: 'Özel Kalem'
} as const; 