import { apiClient } from './client';
import type { AuthResponse, AppUser } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  preferredRegion?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/api/auth/login', payload).then((r) => r.data),

  me: () => apiClient.get<AppUser>('/api/auth/me').then((r) => r.data),

  updateProfile: (preferredRegion: string) =>
    apiClient.put<AppUser>('/api/auth/me', { preferredRegion }).then((r) => r.data),
};
