'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiltroStatus, Tarefa } from '@/types';
import { useTarefas } from '@/hooks/useTarefas';
import { TaskFilter } from '@/components/TaskFilter';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { isAuthenticated, getEmail, clearSession } from '@/lib/session';

export default function Home() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<FiltroStatus>(undefined);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  const { tarefas, loading, erro, criar, alterar, deletar, toggleStatus } =
    useTarefas(filtro);

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [router]);

  function handleDeletar(id: string) {
    setConfirmandoId(id);
  }

  async function handleConfirmar() {
    if (!confirmandoId) return;
    const id = confirmandoId;
    setConfirmandoId(null);
    await deletar(id);
  }

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  const pendentes = tarefas.filter((t) => !t.statusTarefa);
  const concluidas = tarefas.filter((t) => t.statusTarefa);

  return (
    <main className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-500">To-Do List</h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-xs hidden sm:block">{getEmail()}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 text-sm transition"
              >
                Sair
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''} ·{' '}
            {concluidas.length} concluída{concluidas.length !== 1 ? 's' : ''}
          </p>
          <TaskFilter filtro={filtro} onChange={setFiltro} />
        </div>

        <TaskForm onSubmit={criar} />

        {erro && <p className="text-red-500 text-sm text-center mb-4">{erro}</p>}

        {loading ? (
          <p className="text-gray-600 text-center py-8">Carregando...</p>
        ) : tarefas.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhuma tarefa. Crie uma acima.</p>
        ) : (
          <ul className="space-y-2">
            {tarefas.map((tarefa) => (
              <TaskCard
                key={tarefa.id}
                tarefa={tarefa}
                onToggle={toggleStatus}
                onEditar={setEditando}
                onDeletar={handleDeletar}
              />
            ))}
          </ul>
        )}
      </div>

      {editando && (
        <TaskModal
          tarefa={editando}
          onSalvar={alterar}
          onFechar={() => setEditando(null)}
        />
      )}

      {confirmandoId && (
        <ConfirmModal
          mensagem="Tem certeza que deseja excluir esta tarefa?"
          onConfirmar={handleConfirmar}
          onCancelar={() => setConfirmandoId(null)}
        />
      )}
    </main>
  );
}
