import api from '@/lib/axios';
import { Tarefa, TarefaRequest } from '@/types';

type ListaResponse = { content: Tarefa[] } | Tarefa[];

export async function listarTarefas(status?: boolean): Promise<Tarefa[]> {
  const params = status !== undefined ? { status } : {};
  const { data } = await api.get<ListaResponse>('/api/v1/tarefas', { params });
  return Array.isArray(data) ? data : data.content;
}

export async function criarTarefa(payload: TarefaRequest): Promise<Tarefa> {
  const { data } = await api.post<Tarefa>('/api/v1/tarefas', payload);
  return data;
}

export async function alterarTarefa(
  id: string,
  payload: Partial<TarefaRequest>
): Promise<Tarefa> {
  const { data } = await api.patch<Tarefa>(`/api/v1/tarefas/${id}`, payload);
  return data;
}

export async function deletarTarefa(id: string): Promise<void> {
  await api.delete(`/api/v1/tarefas/${id}`);
}
