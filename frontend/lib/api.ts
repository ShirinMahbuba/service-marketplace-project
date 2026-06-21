const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export function authHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
