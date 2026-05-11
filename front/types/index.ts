export interface Tarefa {
  id: string;
  nomeTarefa: string;
  descricaoTarefa?: string;
  dataInicioTarefa?: string;
  dataFimTarefa?: string;
  statusTarefa: boolean;
}

export interface TarefaRequest {
  nomeTarefa: string;
  descricaoTarefa?: string;
  dataInicioTarefa?: string;
  dataFimTarefa?: string;
  statusTarefa: boolean;
}
