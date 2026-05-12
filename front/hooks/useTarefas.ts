import { useState, useCallback, useEffect } from 'react';
import { Tarefa, TarefaRequest, FiltroStatus } from '@/types';
import {
  listarTarefas,
  criarTarefa,
  alterarTarefa,
  deletarTarefa,
} from '@/services/tarefas.service';
import { extractErrorMessage } from '@/utils/error';

interface UseTarefasReturn {
  tarefas: Tarefa[];
  loading: boolean;
  erro: string;
  criar: (payload: TarefaRequest) => Promise<void>;
  alterar: (id: string, payload: Partial<TarefaRequest>) => Promise<void>;
  deletar: (id: string) => Promise<void>;
  toggleStatus: (tarefa: Tarefa) => Promise<void>;
}

export function useTarefas(filtro: FiltroStatus): UseTarefasReturn {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const data = await listarTarefas(filtro);
      setTarefas(data);
    } catch (e) {
      setErro(extractErrorMessage(e, 'Erro ao carregar tarefas'));
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criar = useCallback(
    async (payload: TarefaRequest) => {
      await criarTarefa(payload);
      await carregar();
    },
    [carregar]
  );

  const alterar = useCallback(
    async (id: string, payload: Partial<TarefaRequest>) => {
      await alterarTarefa(id, payload);
      await carregar();
    },
    [carregar]
  );

  const deletar = useCallback(
    async (id: string) => {
      try {
        await deletarTarefa(id);
        await carregar();
      } catch (e) {
        setErro(extractErrorMessage(e, 'Erro ao excluir tarefa'));
      }
    },
    [carregar]
  );

  const toggleStatus = useCallback(
    async (tarefa: Tarefa) => {
      try {
        await alterarTarefa(tarefa.id, { statusTarefa: !tarefa.statusTarefa });
        await carregar();
      } catch {
        // toggle silencioso — não exibe erro para o usuário
      }
    },
    [carregar]
  );

  return { tarefas, loading, erro, criar, alterar, deletar, toggleStatus };
}
