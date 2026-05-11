'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tarefa, TarefaRequest } from '@/types';
import { listarTarefas, criarTarefa, alterarTarefa, deletarTarefa } from '@/services/api';

const emptyForm: TarefaRequest = { nomeTarefa: '', descricaoTarefa: '', statusTarefa: false };

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [form, setForm] = useState<TarefaRequest>(emptyForm);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    const data = await listarTarefas();
    setTarefas(data);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nomeTarefa.trim()) { setErro('Nome é obrigatório'); return; }
    setErro('');
    await criarTarefa(form);
    setForm(emptyForm);
    carregar();
  }

  async function handleToggle(tarefa: Tarefa) {
    await alterarTarefa(tarefa.id, { statusTarefa: !tarefa.statusTarefa });
    carregar();
  }

  async function handleDeletar(id: string) {
    await deletarTarefa(id);
    carregar();
  }

  async function handleSalvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;
    await alterarTarefa(editando.id, {
      nomeTarefa: editando.nomeTarefa,
      descricaoTarefa: editando.descricaoTarefa,
    });
    setEditando(null);
    carregar();
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
            value={form.descricaoTarefa}
            onChange={e => setForm({ ...form, descricaoTarefa: e.target.value })}
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
          >
            + Adicionar Tarefa
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
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => setEditando(tarefa)}
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
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Salvar
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
