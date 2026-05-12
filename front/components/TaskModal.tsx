'use client';

import { useState } from 'react';
import { Tarefa, TarefaRequest } from '@/types';
import { extractErrorMessage } from '@/utils/error';

interface Props {
  tarefa: Tarefa;
  onSalvar: (id: string, payload: Partial<TarefaRequest>) => Promise<void>;
  onFechar: () => void;
}

export function TaskModal({ tarefa, onSalvar, onFechar }: Props) {
  const [form, setForm] = useState<Tarefa>(tarefa);
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nomeTarefa.trim()) {
      setErro('Nome é obrigatório');
      return;
    }
    setErro('');
    setSubmitting(true);
    try {
      await onSalvar(tarefa.id, {
        nomeTarefa: form.nomeTarefa,
        descricaoTarefa: form.descricaoTarefa,
        dataInicioTarefa: form.dataInicioTarefa,
        dataFimTarefa: form.dataFimTarefa,
      });
      onFechar();
    } catch (e) {
      setErro(extractErrorMessage(e, 'Erro ao salvar tarefa'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-10"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md space-y-3"
      >
        <h2 className="text-lg font-bold text-blue-500 mb-4">Editar Tarefa</h2>
        <input
          className="w-full bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition"
          placeholder="Nome da tarefa"
          value={form.nomeTarefa}
          onChange={(e) => setForm({ ...form, nomeTarefa: e.target.value })}
        />
        <input
          className="w-full bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition"
          placeholder="Descrição"
          value={form.descricaoTarefa ?? ''}
          onChange={(e) => setForm({ ...form, descricaoTarefa: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            type="date"
            title="Data de início"
            className="flex-1 bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
            value={form.dataInicioTarefa ?? ''}
            onChange={(e) =>
              setForm({ ...form, dataInicioTarefa: e.target.value || undefined })
            }
          />
          <input
            type="date"
            title="Data de prazo"
            className="flex-1 bg-black border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
            value={form.dataFimTarefa ?? ''}
            onChange={(e) =>
              setForm({ ...form, dataFimTarefa: e.target.value || undefined })
            }
          />
        </div>
        {erro && <p className="text-red-500 text-sm">{erro}</p>}
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
            onClick={onFechar}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
