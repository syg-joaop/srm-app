import { z } from "zod";

// =============================================================================
// STATUS
// =============================================================================

export const STATUS_OCORRENCIA = {
  pendente: { cor: "yellow", icone: "Clock", label: "Pendente" },
  acompanhamento: { cor: "blue", icone: "Eye", label: "Em Acompanhamento" },
  concluida: { cor: "green", icone: "CheckCircle", label: "Atendimento Ok" },
} as const;

export type StatusOcorrencia = keyof typeof STATUS_OCORRENCIA;

export const getStatusCor = (status: string) => {
  const statusLower = status?.toLowerCase() ?? "";
  return STATUS_OCORRENCIA[statusLower as StatusOcorrencia]?.cor ?? "gray";
};

export const getStatusLabel = (status: string) => {
  const statusLower = status?.toLowerCase() ?? "";
  return STATUS_OCORRENCIA[statusLower as StatusOcorrencia]?.label ?? status;
};

// =============================================================================
// OPÇÕES DE FILTRO
// =============================================================================

export const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Pendente", value: "pendente" },
  { label: "Em Acompanhamento", value: "acompanhamento" },
  { label: "Atendimento Ok", value: "concluida" },
] as const;

export const ATENDENTE_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Sygecom", value: "Sygecom" },
  { label: "Dahm", value: "Dahm" },
  { label: "Alexnlv", value: "Alexnlv" },
  { label: "Alex sygecom", value: "Alex sygecom" },
] as const;

export const SITUACAO_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Aberta", value: "aberta" },
  { label: "Fechada", value: "fechada" },
] as const;

export const FORMA_ATENDIMENTO_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Via Web", value: "web" },
  { label: "Telefone", value: "telefone" },
  { label: "Presencial", value: "presencial" },
] as const;

export const ORDENAR_POR_OPTIONS = [
  { label: "Data da Ocorrência", value: "data_ocorrencia" },
  { label: "Data do Próx. Atendimento", value: "data_proximo" },
  { label: "Data de cadastro", value: "data_cadastro" },
] as const;

// =============================================================================
// VALORES PADRÃO
// =============================================================================

export const FILTROS_PADRAO = {
  atendente: "",
  situacao: "",
  formaAtendimento: "",
  status: "",
  ordenarPor: "data_cadastro",
} as const;

export const PAGINACAO_PADRAO = {
  page: 1,
  itemsPerPage: 10,
} as const;

// =============================================================================
// MAPEAMENTO DE CAMPOS (API -> UI)
// =============================================================================

/**
 * Mapeia os nomes abreviados da API para nomes legíveis na UI.
 */
export const CAMPO_LABELS = {
  num: "Número da Ocorrência",
  codcli: "Código do Cliente",
  codfor: "Código do Fornecedor",
  data_oco: "Data da Ocorrência",
  tipo_ate: "Tipo de Atendimento",
  oco: "Descrição da Ocorrência",
  data_pro: "Data do Próximo Atendimento",
  sr_recno: "Registro Interno",
  hora_oco: "Hora da Ocorrência",
  atendente_enc: "Atendente Encaminhado",
  user_diagnostico: "Usuário do Diagnóstico",
} as const;

// =============================================================================
// SCHEMAS E TIPOS
// =============================================================================

export const ocorrenciaFiltersLocalSchema = z.object({
  atendente: z.string(),
  situacao: z.string(),
  formaAtendimento: z.string(),
  status: z.string(),
  ordenarPor: z.string(),
});

export type OcorrenciaFiltersLocal = z.infer<typeof ocorrenciaFiltersLocalSchema>;

export const ocorrenciaFilterKeySchema = z.enum([
  "search",
  "atendente",
  "situacao",
  "formaAtendimento",
  "status",
]);

export type OcorrenciaFilterKey = z.infer<typeof ocorrenciaFilterKeySchema>;

// =============================================================================
// RESET DE FILTROS
// =============================================================================

/**
 * Cria um objeto com funções de reset para cada filtro.
 */
export const createFilterResetMap = (
  filters: { value: OcorrenciaFiltersLocal },
  search: { value: string },
) => ({
  search: () => (search.value = ""),
  atendente: () => (filters.value.atendente = ""),
  situacao: () => (filters.value.situacao = ""),
  formaAtendimento: () => (filters.value.formaAtendimento = ""),
  status: () => (filters.value.status = ""),
});
