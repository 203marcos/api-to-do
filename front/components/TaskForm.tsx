'use client';

import { useState } from 'react';
import { TarefaRequest } from '@/types';
import { extractErrorMessage } from '@/utils/error';

const FORM_VAZIO: TarefaRequest = {
  nomeTarefa: '',
  descricaoTarefa: '',
  statusTarefa: false,
};

interface Props {
  onSubmit: (payload: TarefaRequest) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [form, setForm] = useState<TarefaRequest>(FORM_VAZIO);
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
      await onSubmit(form);
      setForm(FORM_VAZIO);
    } catch (e) {
      setErro(extractErrorMessage(e, 'Erro ao criar tarefa'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-2">
      <input
        className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
        placeholder="Nome da tarefa *"
        value={form.nomeTarefa}
        onChange={(e) => setForm({ ...form, nomeTarefa: e.target.value })}
      />
      <input
        className="w-full bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition placeholder-gray-600"
        placeholder="Descrição (opcional)"
        value={form.descricaoTarefa ?? ''}
        onChange={(e) => setForm({ ...form, descricaoTarefa: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          type="date"
          title="Data de início"
          className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
          value={form.dataInicioTarefa ?? ''}
          onChange={(e) =>
            setForm({ ...form, dataInicioTarefa: e.target.value || undefined })
          }
        />
        <input
          type="date"
          title="Data de prazo"
          className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-600 rounded-lg px-4 py-3 outline-none transition text-gray-400"
          value={form.dataFimTarefa ?? ''}
          onChange={(e) =>
            setForm({ ...form, dataFimTarefa: e.target.value || undefined })
          }
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
  );
}
