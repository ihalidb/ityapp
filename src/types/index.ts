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
  allowedPages: PageKey[];
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

// Yetkilendirme için kullanılacak sayfa anahtarları
export type PageKey =
  | 'dashboard'
  | 'my-requests'
  | 'new-request'
  | 'admin/users'
  | 'admin/roles'
  | 'admin/requests';

export const PAGE_DEFINITIONS: { key: PageKey; label: string; path: string }[] = [
  { key: 'dashboard', label: 'Tüm Talepler', path: '/' },
  { key: 'my-requests', label: 'Kendi Taleplerim', path: '/my-requests' },
  { key: 'new-request', label: 'Yeni Talep', path: '/requests/new' },
  { key: 'admin/users', label: 'Kullanıcılar', path: '/admin/users' },
  { key: 'admin/roles', label: 'Rol Yönetimi', path: '/admin/roles' },
  { key: 'admin/requests', label: 'Talep Yönetimi', path: '/admin/requests' },
]; 