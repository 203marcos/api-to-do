'use client';

import { Tarefa } from '@/types';

interface Props {
  tarefa: Tarefa;
  onToggle: (tarefa: Tarefa) => void;
  onEditar: (tarefa: Tarefa) => void;
  onDeletar: (id: string) => void;
}

export function TaskCard({ tarefa, onToggle, onEditar, onDeletar }: Props) {
  return (
    <li className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-start gap-3">
      <input
        type="checkbox"
        checked={tarefa.statusTarefa}
        onChange={() => onToggle(tarefa)}
        className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${
            tarefa.statusTarefa ? 'line-through text-gray-600' : 'text-white'
          }`}
        >
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
          onClick={() => onEditar(tarefa)}
          className="text-blue-500 hover:text-blue-400 text-sm transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDeletar(tarefa.id)}
          className="text-gray-600 hover:text-red-500 text-sm transition"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
