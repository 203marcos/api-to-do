'use client';

import { useState } from 'react';
import { TarefaRequest } from '@/types';
import { extractErrorMessage } from '@/utils/error';
import { TarefaFields, TarefaFormValues } from './TarefaFields';

const FORM_VAZIO: TarefaFormValues = {
  nomeTarefa: '',
  descricaoTarefa: '',
};

interface Props {
  onSubmit: (payload: TarefaRequest) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [values, setValues] = useState<TarefaFormValues>(FORM_VAZIO);
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.nomeTarefa.trim()) {
      setErro('Nome é obrigatório');
      return;
    }
    setErro('');
    setSubmitting(true);
    try {
      await onSubmit({ ...values, statusTarefa: false });
      setValues(FORM_VAZIO);
    } catch (e) {
      setErro(extractErrorMessage(e, 'Erro ao criar tarefa'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-2">
      <TarefaFields values={values} onChange={setValues} />
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
