import { Tarefa, TarefaRequest } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const URL = `${BASE}/api/v1/tarefas`;

export async function listarTarefas(): Promise<Tarefa[]> {
  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function criarTarefa(data: TarefaRequest): Promise<Tarefa> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao criar tarefa');
  }
  return res.json();
}

export async function alterarTarefa(id: string, data: Partial<TarefaRequest>): Promise<Tarefa> {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao atualizar tarefa');
  }
  return res.json();
}

export async function deletarTarefa(id: string): Promise<void> {
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Erro ao deletar tarefa');
  }
}
