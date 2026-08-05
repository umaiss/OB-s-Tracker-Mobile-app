import { apiRequest } from '../api/client';
import { saveTokens, getTokens, clearTokens } from './tokenStorage';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OFFICE_BOY';
  phone: string;
  isActive: boolean;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
};

export async function login(email: string, password: string): Promise<User> {
  const data = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    requiresAuth: false, // no token exists yet before login
  });

  await saveTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return data.user;
}

export async function getProfile(): Promise<User> {
  return apiRequest<User>('/auth/profile', { method: 'GET' });
}

export async function logout(): Promise<void> {
  const tokens = await getTokens();

  if (tokens) {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: { refreshToken: tokens.refreshToken },
        requiresAuth: false,
      });
    } catch {
      // Doc says logout always "succeeds" server-side regardless — clear locally either way.
    }
  }

  await clearTokens();
}