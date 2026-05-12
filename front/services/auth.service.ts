import api from '@/lib/axios';
import { LoginRequest, AuthResponse } from '@/types';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registro(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/registro', payload);
  return data;
}
