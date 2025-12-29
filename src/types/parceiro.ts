/**
 * Tipos relacionados ao parceiro e suas visualizações.
 */

export type ParceiroVariant = "parceiro" | "atendente" | "time";

export type TabId =
  | "cadastro"
  | "contatos"
  | "cargas"
  | "agendamentos"
  | "atendimentos"
  | "coletas"
  | "precos"
  | "checkins"
  | "favorecidos";

export interface ParceiroData {
  name?: string;
  status?: string;
  location?: string;
  date?: string;
  role?: string;
  fornecedor?: string;
  fanta?: string;
  codfor?: string;
  categoria?: string;
  cidade?: string;
  uf?: string;
  data?: string;
  ultima_carga?: string;
  ende?: string;
  comp?: string;
  fone?: string;
  celular?: string;
  tel3?: string;
  email?: string;
  contatos?: unknown[];
  cargas?: unknown[];
  agendamentos?: unknown[];
  atendimentos?: unknown[];
  coletas?: unknown[];
  precos?: unknown[];
  checkins?: unknown[];
  favorecidos?: unknown[];
  [key: string]: unknown;
}

export interface DetailPair {
  label: string;
  value: string;
}

export interface TabItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  details: DetailPair[];
}

export interface TabOption {
  id: TabId;
  label: string;
}

export interface EmptyStateCopy {
  title: string;
  description: string;
}

export interface FieldMapping {
  key: string;
  label: string;
}
