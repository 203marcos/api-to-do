'use client';

import { FiltroStatus } from '@/types';

interface Props {
  filtro: FiltroStatus;
  onChange: (value: FiltroStatus) => void;
}

const OPCOES: { label: string; value: FiltroStatus }[] = [
  { label: 'Todas', value: undefined },
  { label: 'Pendentes', value: false },
  { label: 'Concluídas', value: true },
];

export function TaskFilter({ filtro, onChange }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      {OPCOES.map((op) => (
        <button
          key={String(op.value)}
          onClick={() => onChange(op.value)}
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
  );
}
