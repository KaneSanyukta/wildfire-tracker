import { apiClient } from './client';
import type { FireIncident, FireIncidentInput } from '../types';

export interface FireFilters {
  search?: string;
  riskLevel?: string;
  status?: string;
}

export const fireApi = {
  getAll: (filters: FireFilters = {}) =>
    apiClient
      .get<FireIncident[]>('/api/fires', { params: filters })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<FireIncident>(`/api/fires/${id}`).then((r) => r.data),

  create: (payload: FireIncidentInput) =>
    apiClient.post<FireIncident>('/api/fires', payload).then((r) => r.data),

  update: (id: number, payload: FireIncidentInput) =>
    apiClient.put<FireIncident>(`/api/fires/${id}`, payload).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`/api/fires/${id}`).then((r) => r.data),
};
