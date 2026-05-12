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

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export type FiltroStatus = boolean | undefined;
