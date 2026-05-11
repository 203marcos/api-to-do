'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tarefa, TarefaRequest } from '@/types';
import { listarTarefas, criarTarefa, alterarTarefa, deletarTarefa } from '@/services/api';

const emptyForm: TarefaRequest = { nomeTarefa: '', descricaoTarefa: '', statusTarefa: false };

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [form, setForm] = useState<TarefaRequest>(emptyForm);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [filtro, setFiltro] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');
  const [erroEdicao, setErroEdicao] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    const data = await listarTarefas(filtro);
    setTarefas(data);
    setLoading(false);
  }, [filtro]);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nomeTarefa.trim()) { setErro('Nome é obrigatório'); return; }
    setErro('');
    setSubmitting(true);
    try {
      await criarTarefa(form);
      setForm(emptyForm);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar tarefa');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(tarefa: Tarefa) {
    try {
      await alterarTarefa(tarefa.id, { statusTarefa: !tarefa.statusTarefa });
      carregar();
    } catch {
      // toggle silencioso
    }
  }

  async function handleDeletar(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await deletarTarefa(id);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao excluir tarefa');
    }
  }

  async function handleSalvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;
    if (!editando.nomeTarefa.trim()) { setErroEdicao('Nome é obrigatório'); return; }
    setErroEdicao('');
    setSubmitting(true);
    try {
      await alterarTarefa(editando.id, {
        nomeTarefa: editando.nomeTarefa,
        descricaoTarefa: editando.descricaoTarefa,
        dataInicioTarefa: editando.dataInicioTarefa,
        dataFimTarefa: editando.dataFimTarefa,
      });
      setEditando(null);
      carregar();
    } catch (e) {
      setErroEdicao(e instanceof Error ? e.message : 'Erro ao salvar tarefa');
    } finally {
      setSubmitting(false);
    }
  }

  const pendentes = tarefas.filter(t => !t.statusTarefa);
  const concluidas = tarefas.filter(t => t.statusTarefa);

  return (
    <main className="min-h-screen bg-black p-6 md:p-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-500">To-Do List</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''} · {concluidas.length} concluída{concluidas.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2 mt-4">
            {[
              { label: 'Todas', value: undefined },
              { label: 'Pendentes', value: false },
              { label: 'Concluídas', value: true },
            ].map(op => (
              <button
                key={String(op.value)}
                onClick={() => setFiltro(op.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filtro === op.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form criar */}
        <form onSubmit={handleCriar} className="mb-8 space-y-2">
          <input
            className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
            placeholder="Nome da tarefa *"
            value={form.nomeTarefa}
            onChange={e => setForm({ ...form, nomeTarefa: e.target.value })}
          />
          <input
            className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
            placeholder="Descrição (opcional)"
            value={form.descricaoTarefa ?? ''}
            onChange={e => setForm({ ...form, descricaoTarefa: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
              title="Data de início"
              value={form.dataInicioTarefa ?? ''}
              onChange={e => setForm({ ...form, dataInicioTarefa: e.target.value || undefined })}
            />
            <input
              type="date"
              className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
              title="Data de prazo"
              value={form.dataFimTarefa ?? ''}
              onChange={e => setForm({ ...form, dataFimTarefa: e.target.value || undefined })}
            />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {submitting ? 'Adicionando...' : '+ Adicionar Tarefa'}
          </button>
        </form>

        {/* Lista */}
        {loading ? (
          <p className="text-gray-600 text-center py-8">Carregando...</p>
        ) : tarefas.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhuma tarefa. Crie uma acima.</p>
        ) : (
          <ul className="space-y-2">
            {tarefas.map(tarefa => (
              <li
                key={tarefa.id}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={tarefa.statusTarefa}
                  onChange={() => handleToggle(tarefa)}
                  className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${tarefa.statusTarefa ? 'line-through text-gray-600' : 'text-white'}`}>
                    {tarefa.nomeTarefa}
                  </p>
                  {tarefa.descricaoTarefa && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{tarefa.descricaoTarefa}</p>
                  )}
                  {(tarefa.dataInicioTarefa || tarefa.dataFimTarefa) && (
                    <p className="text-xs text-gray-600 mt-1">
                      {tarefa.dataInicioTarefa && `Início: ${tarefa.dataInicioTarefa}`}
                      {tarefa.dataInicioTarefa && tarefa.dataFimTarefa && ' · '}
                      {tarefa.dataFimTarefa && `Prazo: ${tarefa.dataFimTarefa}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => { setEditando(tarefa); setErroEdicao(''); }}
                    className="text-blue-500 hover:text-blue-400 text-sm transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletar(tarefa.id)}
                    className="text-gray-600 hover:text-red-500 text-sm transition"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal editar */}
      {editando && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-10"
          onClick={e => e.target === e.currentTarget && setEditando(null)}
        >
          <form
            onSubmit={handleSalvarEdicao}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md space-y-3"
          >
            <h2 className="text-lg font-bold text-blue-500 mb-4">Editar Tarefa</h2>
            <input
              className="w-full bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition"
              value={editando.nomeTarefa}
              onChange={e => setEditando({ ...editando, nomeTarefa: e.target.value })}
              placeholder="Nome da tarefa"
            />
            <input
              className="w-full bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition"
              value={editando.descricaoTarefa ?? ''}
              onChange={e => setEditando({ ...editando, descricaoTarefa: e.target.value })}
              placeholder="Descrição"
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
                title="Data de início"
                value={editando.dataInicioTarefa ?? ''}
                onChange={e => setEditando({ ...editando, dataInicioTarefa: e.target.value || undefined })}
              />
              <input
                type="date"
                className="flex-1 bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
                title="Data de prazo"
                value={editando.dataFimTarefa ?? ''}
                onChange={e => setEditando({ ...editando, dataFimTarefa: e.target.value || undefined })}
              />
            </div>
            {erroEdicao && <p className="text-red-500 text-sm">{erroEdicao}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
              >
                {submitting ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
