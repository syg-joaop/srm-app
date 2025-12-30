/**
 * Tipos relacionados ao parceiro e suas visualizações.
 */

import type { Agendamento } from '~/server/schemas/agendamento.schema';
import type { Atendimento } from '~/server/schemas/atendimento.schema';
import type { Carga } from '~/server/schemas/carga.schema';
import type { Checkin } from '~/server/schemas/checkin.schema';
import type { Coleta } from '~/server/schemas/coleta.schema';
import type { Contato } from '~/server/schemas/contato.schema';
import type { Favorecido } from '~/server/schemas/favorecido.schema';
import type { Preco } from '~/server/schemas/preco.schema';

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
  codpros?: string;
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
  contatos?: Contato[];
  cargas?: Carga[];
  agendamentos?: Agendamento[];
  atendimentos?: Atendimento[];
  coletas?: Coleta[];
  precos?: Preco[];
  checkins?: Checkin[];
  favorecidos?: Favorecido[];
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
  details: EnhancedDetail[];
  rightLabel?: string;
  detailsLayout?: 'grid' | 'list';
}

export interface ParceiroTabOption {
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

/**
 * Enhanced Detail Types
 * Types para detalhes com metadata especial (separadores, totais, produtos)
 * Permitem type safety completo sem usar casts 'as any'
 */

/** Detalhe separador visual (usado em listas) */
export interface SeparatorDetail extends DetailPair {
  __type: 'separator';
}

/** Detalhe de total (destacado visualmente) */
export interface TotalDetail extends DetailPair {
  __type: 'total';
}

/** Detalhe de produto em uma lista de produtos */
export interface ProductDetail extends DetailPair {
  __type: 'product';
  produtoIndex?: number;
}

/** Union type de todos os tipos de detalhes */
export type EnhancedDetail = DetailPair | SeparatorDetail | TotalDetail | ProductDetail;

/**
 * Type Guards
 * Funções para verificar o tipo de um Detail em runtime
 * Substituem de forma type-safe os casts 'as any'
 */
export const isSeparatorDetail = (detail: EnhancedDetail): detail is SeparatorDetail => {
  return '__type' in detail && detail.__type === 'separator';
};

export const isTotalDetail = (detail: EnhancedDetail): detail is TotalDetail => {
  return '__type' in detail && detail.__type === 'total';
};

export const isProductDetail = (detail: EnhancedDetail): detail is ProductDetail => {
  return '__type' in detail && detail.__type === 'product';
};

/**
 * Tipos específicos para domínios
 */

/** Registro de carga com campos específicos */
export interface CargaRecord {
  count?: string | number;
  data_peso?: string | null;
  data_entrega?: string | null;
  [key: string]: unknown;
}
