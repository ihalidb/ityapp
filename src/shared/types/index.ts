// Base types used across the application
export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  phone: string;
  role: string;
  allowedPages?: PageKey[];
}

export interface Role {
  id: number;
  name: string;
  code: string;
  order: number;
  allowedPages: PageKey[];
}

export interface Department {
  id: number;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUserPermissions: () => Promise<void>;
}

// Page authorization types
export type PageKey = 
  | 'dashboard'
  | 'my-requests'
  | 'new-request'
  | 'organization'
  | 'admin/request-management'
  | 'admin/organization'
  | 'admin/users'
  | 'admin/roles';

export const PAGE_DEFINITIONS: { key: PageKey; label: string; path: string; group?: string }[] = [
  { key: 'new-request', label: 'Yeni Talep Aç', path: '/new-request' },
  { key: 'my-requests', label: 'Taleplerim', path: '/my-requests' },
  { key: 'dashboard', label: 'Tüm Talepler', path: '/' },
  { key: 'admin/request-management', label: 'Talep Yönetimi', path: '/admin/request-management' },
  { key: 'organization', label: 'Organizasyon', path: '/organization' },
  { key: 'admin/organization', label: 'Organizasyon Yönetimi', path: '/admin/organization', group: 'management' },
  { key: 'admin/users', label: 'Kullanıcılar', path: '/admin/users', group: 'management' },
  { key: 'admin/roles', label: 'Roller', path: '/admin/roles', group: 'management' }
];

export const USER_ROLES = {
  ADMIN: 'admin',
  MAHALLE_BASKANI: 'mahalle_baskani',
  MECLIS_UYESI: 'meclis_uyesi',
  YONETIM_KURULU_UYESI: 'yonetim_kurulu_uyesi',
  YURUTME_KURULU_UYESI: 'yurutme_kurulu_uyesi',
  ILCE_BASKANI: 'ilce_baskani',
  OZEL_KALEM: 'ozel_kalem'
} as const; 