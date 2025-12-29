export type OcorrenciaStatus = "pendente" | "acompanhamento" | "concluida";

export interface Ocorrencia {
  id: number;
  titulo?: string;
  fornecedor: string;
  dataCadastro?: string;
  atendente: string;
  status: OcorrenciaStatus;
  proximoAtendimento?: string;
  encaminhadoPara?: string;
  diagnosticadoPor?: string;
  formaAtendimento?: string;
  situacao?: string;
}