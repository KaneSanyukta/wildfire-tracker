export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Extreme';
export type FireStatus = 'Active' | 'Contained' | 'Controlled' | 'Extinguished';
export type UserRole = 'User' | 'Admin';

export interface FireIncident {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
  fireIntensity: number;
  riskLevel: RiskLevel;
  status: FireStatus;
  detectedAt: string;
  updatedAt?: string | null;
  notes?: string | null;
}

export interface FireIncidentInput {
  locationName: string;
  latitude: number;
  longitude: number;
  fireIntensity: number;
  riskLevel: RiskLevel;
  status: FireStatus;
  notes?: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  preferredRegion?: string | null;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: AppUser;
}
