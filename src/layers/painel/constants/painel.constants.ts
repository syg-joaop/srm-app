import { z } from "zod";

import { dataAtualPrimeiroDiaMes, dataAtualUltimoDiaMes } from "~/utils/formatters/date";

// =============================================================================
// MAPEAMENTO DE ÍCONES
// =============================================================================

/**
 * Mapeia tipos de indicadores para nomes de ícones.
 * Evita switch/case disperso no código.
 */
export const ICON_MAP = {
  fornecedores: "Building2",
  prospectos: "UserPlus",
  ativos: "CheckCircle",
  inativos: "XCircle",
  atendimentos: "MessageSquare",
  vencidos: "AlertTriangle",
  agendados: "Calendar",
} as const;

export const getIconByTipo = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  return ICON_MAP[tipoLower as keyof typeof ICON_MAP] ?? "Info";
};

// =============================================================================
// FILTROS PADRÃO
// =============================================================================

export const FILTROS_PADRAO = {
  data_inicial: dataAtualPrimeiroDiaMes(),
  data_final: dataAtualUltimoDiaMes(),
  data_inicial2: dataAtualPrimeiroDiaMes(),
  data_final2: dataAtualUltimoDiaMes(),
  categoriaFornecedor: "12",
  filial: "TODAS",
  mes_grafico: "atual",
} as const;

// =============================================================================
// PAGINAÇÃO
// =============================================================================

export const PAGINACAO_PADRAO = {
  pageSize: 6,
} as const;

// =============================================================================
// IDS DOS GRÁFICOS
// =============================================================================

export const DASHBOARD_GRAPH_IDS = [
  "INDICADORES_DASHBOARD",
  "INDICADORES_DASHBOARD_COMPRADOR",
  "PROXIMOS_ATENDIMENTOS",
  "PROXIMOS_ATENDIMENTOS_NAO_ADMIN",
  "ATENDIMENTOS_VENCIDOS",
  "ATENDIMENTOS_VENCIDOS_NAO_ADMIN",
  "OCORRENCIAS_12_MESES",
  "OCORRENCIAS_12_MESES_NAO_ADMIN",
  "OCORRENCIAS_6_MESES",
  "OCORRENCIAS_6_MESES_NAO_ADMIN",
  "ANIVERSIANTES_FORNECEDORES",
  "ANIVERSIANTES_CONTATOS",
  "ATENDENTES",
  "META_DIARIA",
  "COMPRAS_MES",
  "COMPRAS_COMPRADOR",
  "PROD_MAIS_COMPRADOS_MES",
  "TOTAL_DESCONTOS",
] as const;

// =============================================================================
// SCHEMAS E TIPOS DE UI
// =============================================================================

export const aniversarianteItemSchema = z.object({
  name: z.string(),
  location: z.string(),
  status: z.string().optional(),
  date: z.string().optional(),
});

export type AniversarianteItem = z.infer<typeof aniversarianteItemSchema>;

export const statusBadgeSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string().optional(),
  color: z.string(),
  icon: z.string().optional(),
});

export const atendenteItemSchema = z.object({
  role: z.string(),
  geral: z.number(),
  periodo: z.number(),
  concluidos: z.number(),
  pendentes: z.number(),
  statuses: z.array(statusBadgeSchema),
});

export type AtendenteItem = z.infer<typeof atendenteItemSchema>;

// =============================================================================
// VARIANTES DE MODAL
// =============================================================================

export const modalVariantSchema = z.enum(["parceiro", "atendente", "time"]);
export type ModalVariant = z.infer<typeof modalVariantSchema>;
