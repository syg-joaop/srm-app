/**
 * Tipos compartilhados entre componentes UI para exibição de detalhes.
 *
 */

// ============================================================================
// TIPOS DE DETALHES
// ============================================================================

export interface DetailPair {
  label: string;
  value: string;
}

export interface SeparatorDetail extends DetailPair {
  __type: "separator";
}

export interface TotalDetail extends DetailPair {
  __type: "total";
}

export interface ProductDetail extends DetailPair {
  __type: "product";
  produtoIndex?: number;
}

export type EnhancedDetail = DetailPair | SeparatorDetail | TotalDetail | ProductDetail;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isSeparatorDetail = (detail: EnhancedDetail): detail is SeparatorDetail => {
  return "__type" in detail && detail.__type === "separator";
};

export const isTotalDetail = (detail: EnhancedDetail): detail is TotalDetail => {
  return "__type" in detail && detail.__type === "total";
};

export const isProductDetail = (detail: EnhancedDetail): detail is ProductDetail => {
  return "__type" in detail && detail.__type === "product";
};

// ============================================================================
// TIPOS DE TABS E UI DE PARCEIRO
// ============================================================================

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

export interface TabItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  details: EnhancedDetail[];
  rightLabel?: string;
  detailsLayout?: "grid" | "list";
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

export type ParceiroVariant = "parceiro" | "atendente" | "time";

export interface CargaRecord {
  count?: string | number;
  data_peso?: string | null;
  data_entrega?: string | null;
  [key: string]: unknown;
}
