import { Tarefa, TarefaRequest } from '@/types';
import { getToken, clearSession } from './auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const URL = `${BASE}/api/v1/tarefas`;

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handle401() {
  clearSession();
  window.location.href = '/login';
}

export async function listarTarefas(status?: boolean): Promise<Tarefa[]> {
  try {
    const query = status !== undefined ? `?status=${status}` : '';
    const res = await fetch(`${URL}${query}`, {
      cache: 'no-store',
      headers: { ...authHeaders() },
    });
    if (res.status === 401) { handle401(); return []; }
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? data;
  } catch {
    return [];
  }
}

export async function criarTarefa(data: TarefaRequest): Promise<Tarefa> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { handle401(); throw new Error('Não autenticado'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao criar tarefa');
  }
  return res.json();
}

export async function alterarTarefa(id: string, data: Partial<TarefaRequest>): Promise<Tarefa> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (res.status === 401) { handle401(); throw new Error('Não autenticado'); }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao atualizar tarefa');
  }
  return res.json();
}

export async function deletarTarefa(id: string): Promise<void> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (res.status === 401) { handle401(); return; }
  if (!res.ok) throw new Error('Erro ao deletar tarefa');
}

export async function login(data: { email: string; senha: string }): Promise<{ token: string; email: string }> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Email ou senha incorretos');
  }
  return res.json();
}

export async function registro(data: { email: string; senha: string }): Promise<{ token: string; email: string }> {
  const res = await fetch(`${BASE}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao criar conta');
  }
  return res.json();
}
