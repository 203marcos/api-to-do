'use client';

import { useId } from 'react';
import { Input } from './Input';

export interface TarefaFormValues {
  nomeTarefa: string;
  descricaoTarefa?: string;
  dataInicioTarefa?: string;
  dataFimTarefa?: string;
}

interface Props {
  values: TarefaFormValues;
  onChange: (updated: TarefaFormValues) => void;
  variant?: 'dark' | 'darker';
}

export function TarefaFields({ values, onChange, variant = 'dark' }: Props) {
  const uid = useId();

  function up(field: keyof TarefaFormValues, val: string | undefined) {
    onChange({ ...values, [field]: val });
  }

  return (
    <>
      <Input
        id={`${uid}-nome`}
        label="Nome da tarefa"
        placeholder="Nome da tarefa *"
        variant={variant}
        value={values.nomeTarefa}
        onChange={(e) => up('nomeTarefa', e.target.value)}
      />
      <Input
        id={`${uid}-descricao`}
        label="Descrição"
        placeholder="Descrição (opcional)"
        variant={variant}
        value={values.descricaoTarefa ?? ''}
        onChange={(e) => up('descricaoTarefa', e.target.value)}
      />
      <div className="flex gap-2">
        <Input
          id={`${uid}-inicio`}
          label="Data de início"
          type="date"
          variant={variant}
          wrapperClassName="flex-1"
          className="text-gray-400"
          value={values.dataInicioTarefa ?? ''}
          onChange={(e) => up('dataInicioTarefa', e.target.value || undefined)}
        />
        <Input
          id={`${uid}-prazo`}
          label="Data de prazo"
          type="date"
          variant={variant}
          wrapperClassName="flex-1"
          className="text-gray-400"
          value={values.dataFimTarefa ?? ''}
          onChange={(e) => up('dataFimTarefa', e.target.value || undefined)}
        />
      </div>
    </>
  );
}
