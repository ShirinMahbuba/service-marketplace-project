export type Role = 'ADMIN' | 'VENDOR' | 'END_USER';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const MOCK_USERS: SessionUser[] = [
  { id: 'admin-001', name: 'Admin User', email: 'admin@marketplace.com', role: 'ADMIN' },
  { id: 'vendor-001', name: 'Rahim Cleaning Services', email: 'rahim@vendor.com', role: 'VENDOR' },
  { id: 'vendor-002', name: 'Karim Plumbing Co.', email: 'karim@vendor.com', role: 'VENDOR' },
  { id: 'vendor-003', name: 'Jamal AC & Appliance', email: 'jamal@vendor.com', role: 'VENDOR' },
  { id: 'user-001', name: 'Fatema Begum', email: 'fatema@user.com', role: 'END_USER' },
];

export const ROLE_REDIRECTS: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  VENDOR: '/vendor/dashboard',
  END_USER: '/marketplace',
};

export const SESSION_COOKIE = 'session_user';
