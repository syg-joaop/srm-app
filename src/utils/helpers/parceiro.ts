/**
 * Helpers para processamento de dados de parceiros.
 */

import type {
  DetailPair,
  EmptyStateCopy,
  FieldMapping,
  ParceiroData,
  ParceiroVariant,
  TabId,
  TabItem,
  TabOption,
} from "~/types/parceiro";

export const ALL_TABS: readonly TabOption[] = [
  { id: "cadastro", label: "Dados de Cadastro" },
  { id: "contatos", label: "Contatos" },
  { id: "cargas", label: "Cargas" },
  { id: "agendamentos", label: "Agendamentos" },
  { id: "atendimentos", label: "Atendimentos" },
  { id: "coletas", label: "Coletas" },
  { id: "precos", label: "Preços" },
  { id: "checkins", label: "Check-in's" },
  { id: "favorecidos", label: "Favorecidos" },
] as const;

export const EMPTY_STATE_COPY: Record<TabId, EmptyStateCopy> = {
  cadastro: {
    title: "Sem dados de cadastro",
    description: "Não há dados de cadastro disponíveis para este parceiro.",
  },
  contatos: {
    title: "Sem contatos",
    description: "Não há contatos cadastrados para este parceiro.",
  },
  cargas: {
    title: "Sem cargas",
    description: "Não há cargas registradas para este parceiro.",
  },
  agendamentos: {
    title: "Sem agendamentos",
    description: "Não há agendamentos registrados para este parceiro.",
  },
  atendimentos: {
    title: "Nenhum atendimento",
    description: "Não há atendimentos registrados para este parceiro.",
  },
  coletas: {
    title: "Sem coletas",
    description: "Não há coletas registradas para este parceiro.",
  },
  precos: {
    title: "Sem preços",
    description: "Não há preços cadastrados para este parceiro.",
  },
  checkins: {
    title: "Sem check-ins",
    description: "Não há check-ins registrados para este parceiro.",
  },
  favorecidos: {
    title: "Sem favorecidos",
    description: "Não há favorecidos cadastrados para este parceiro.",
  },
};

const CADASTRO_FIELDS: FieldMapping[] = [
  { key: "codfor", label: "Codigo" },
  { key: "categoria", label: "Categoria" },
  { key: "data", label: "Cadastro" },
  { key: "ultima_carga", label: "Ultima carga" },
  { key: "cidade", label: "Cidade" },
  { key: "uf", label: "UF" },
  { key: "enderecoCompleto", label: "Endereco" },
];

const CONTATO_FIELDS: FieldMapping[] = [
  { key: "fone", label: "Telefone" },
  { key: "celular", label: "Celular" },
  { key: "tel3", label: "Telefone 2" },
  { key: "email", label: "Email" },
];

const CARGA_FIELDS: FieldMapping[] = [
  { key: "ultima_carga", label: "Ultima carga" },
  { key: "cidade", label: "Cidade" },
  { key: "uf", label: "UF" },
];

const GENERIC_TITLE_KEYS = [
  "titulo",
  "title",
  "nome",
  "name",
  "descricao",
  "id",
  "codigo",
  "codfor",
] as const;

const GENERIC_SUBTITLE_KEYS = [
  "subtitulo",
  "subtitle",
  "empresa",
  "cidade",
  "data",
  "data_oco",
] as const;

const GENERIC_STATUS_KEYS = ["status", "situacao", "situacao_atual", "tipo"] as const;

/**
 * Normaliza um valor opcional para string.
 */
export const normalizeOptionalValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const simpleValues = value
      .filter((entry) => ["string", "number", "boolean"].includes(typeof entry))
      .map(String);
    return simpleValues.length ? simpleValues.join(", ") : "";
  }
  return "";
};

/**
 * Formata um valor para exibição, usando "-" como padrão.
 */
export const formatDetailValue = (value: unknown): string =>
  normalizeOptionalValue(value) || "-";

/**
 * Busca o primeiro valor disponível em um registro usando uma lista de chaves.
 */
export const pickValueWithKey = (
  record: Record<string, unknown>,
  keys: readonly string[],
): { key: string; value: string } => {
  for (const key of keys) {
    const value = normalizeOptionalValue(record[key]);
    if (value) return { key, value };
  }
  return { key: "", value: "" };
};

/**
 * Converte uma chave em um label legível.
 */
export const toLabel = (key: string): string => {
  const cleaned = key.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return key;
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Constrói um array de DetailPair a partir de campos mapeados.
 */
export const buildDetailsFromFields = (
  record: Record<string, unknown>,
  fields: FieldMapping[],
): DetailPair[] =>
  fields
    .map((field) => ({
      label: field.label,
      value: formatDetailValue(record[field.key]),
    }))
    .filter((detail) => detail.value !== "-");

/**
 * Constrói itens para a aba de cadastro.
 */
export const buildCadastroItems = (record: Record<string, unknown>): TabItem[] => {
  const enderecoCompleto = [
    normalizeOptionalValue(record.ende),
    normalizeOptionalValue(record.comp),
  ]
    .filter(Boolean)
    .join(", ");
  const enrichedRecord = { ...record, enderecoCompleto };
  const details = buildDetailsFromFields(enrichedRecord, CADASTRO_FIELDS);
  const title = pickValueWithKey(enrichedRecord, ["name", "fornecedor", "nome", "titulo"]).value;
  const subtitle = pickValueWithKey(enrichedRecord, ["fanta", "fantasia", "location", "cidade"])
    .value;
  const status = pickValueWithKey(enrichedRecord, ["status", "situacao"]).value;
  const hasAny = details.length || title || subtitle || status;
  if (!hasAny) return [];
  const idValue =
    normalizeOptionalValue(enrichedRecord.codfor) ||
    normalizeOptionalValue(enrichedRecord.id) ||
    "cadastro";
  return [
    {
      id: `cadastro-${idValue}`,
      title: title || "Cadastro",
      subtitle: subtitle || undefined,
      status: status || undefined,
      details,
    },
  ];
};

/**
 * Constrói itens para a aba de contatos.
 */
export const buildContatoItems = (record: Record<string, unknown>): TabItem[] => {
  const details = buildDetailsFromFields(record, CONTATO_FIELDS);
  const title = pickValueWithKey(record, ["name", "fornecedor", "nome"]).value;
  const subtitle = pickValueWithKey(record, ["fanta", "fantasia"]).value;
  const hasAny = details.length || title || subtitle;
  if (!hasAny) return [];
  const idValue =
    normalizeOptionalValue(record.codfor) || normalizeOptionalValue(record.id) || "contatos";
  return [
    {
      id: `contatos-${idValue}`,
      title: title || "Contato",
      subtitle: subtitle || undefined,
      details,
    },
  ];
};

/**
 * Constrói itens de fallback para a aba de cargas.
 */
export const buildCargaFallbackItems = (record: Record<string, unknown>): TabItem[] => {
  const details = buildDetailsFromFields(record, CARGA_FIELDS);
  const hasAny = details.length;
  if (!hasAny) return [];
  const idValue =
    normalizeOptionalValue(record.codfor) || normalizeOptionalValue(record.id) || "cargas";
  return [
    {
      id: `cargas-${idValue}`,
      title: "Resumo de cargas",
      subtitle: pickValueWithKey(record, ["fornecedor", "name", "nome"]).value || undefined,
      details,
    },
  ];
};

/**
 * Constrói itens genéricos para abas que usam dados de array.
 */
export const buildGenericItems = (items: unknown[], tabId: TabId): TabItem[] => {
  const tabLabelById = ALL_TABS.reduce(
    (acc, tab) => {
      acc[tab.id] = tab.label;
      return acc;
    },
    {} as Record<TabId, string>,
  );

  const fallbackLabel = tabLabelById[tabId] || "Item";
  return items
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        const value = normalizeOptionalValue(item);
        return {
          id: `${tabId}-${index}`,
          title: value || `${fallbackLabel} ${index + 1}`,
          details: [],
        };
      }

      const record = item as Record<string, unknown>;
      const titleMatch = pickValueWithKey(record, GENERIC_TITLE_KEYS);
      const subtitleMatch = pickValueWithKey(record, GENERIC_SUBTITLE_KEYS);
      const statusMatch = pickValueWithKey(record, GENERIC_STATUS_KEYS);
      const excludedKeys = [titleMatch.key, subtitleMatch.key, statusMatch.key].filter(Boolean);

      const details = Object.entries(record)
        .filter(([key]) => !excludedKeys.includes(key))
        .filter(([, value]) => {
          if (value === null || value === undefined) return false;
          if (Array.isArray(value)) return false;
          return ["string", "number", "boolean"].includes(typeof value);
        })
        .map(([key, value]) => {
          const normalizedValue = normalizeOptionalValue(value);
          if (!normalizedValue) return null;
          return {
            label: toLabel(key),
            value: normalizedValue,
          };
        })
        .filter((detail): detail is DetailPair => Boolean(detail))
        .slice(0, 6);

      const idValue =
        normalizeOptionalValue(record.id) ||
        normalizeOptionalValue(record.codigo) ||
        normalizeOptionalValue(record.codfor) ||
        `${tabId}-${index}`;

      return {
        id: `${tabId}-${idValue}`,
        title: titleMatch.value || `${fallbackLabel} ${index + 1}`,
        subtitle: subtitleMatch.value || undefined,
        status: statusMatch.value || undefined,
        details,
      };
    })
    .filter((item) => item.title || item.details.length || item.status || item.subtitle);
};

/**
 * Retorna a classe CSS baseada no status.
 */
export const getStatusClass = (status?: string): string => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("inativo") || normalized.includes("cancel")) {
    return "bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]";
  }
  if (normalized.includes("pendente") || normalized.includes("vencido")) {
    return "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]";
  }
  if (
    normalized.includes("ativo") ||
    normalized.includes("concluido") ||
    normalized.includes("final")
  ) {
    return "bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]";
  }
  return "bg-[var(--color-hover)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]";
};

/**
 * Filtra as abas disponíveis com base na variante.
 */
export const filterTabsByVariant = (
  variant: ParceiroVariant,
): TabOption[] => {
  if (variant === "atendente" || variant === "time") {
    return ALL_TABS.filter((t) => ["agendamentos", "atendimentos", "checkins"].includes(t.id));
  }
  return ALL_TABS.filter((t) => t.id !== "agendamentos");
};

/**
 * Retorna a aba inicial com base na variante.
 */
export const getInitialTab = (variant: ParceiroVariant): TabId => {
  if (variant === "atendente" || variant === "time") {
    return "agendamentos";
  }
  return "atendimentos";
};

/**
 * Verifica se o parceiro está inativo.
 */
export const isParceiroInactive = (parceiro: ParceiroData | null): boolean => {
  return (parceiro?.status || "").toLowerCase().trim() === "inativo";
};

/**
 * Retorna o label de uma aba pelo ID.
 */
export const getTabLabel = (tabId: TabId): string => {
  return ALL_TABS.find((t) => t.id === tabId)?.label || "";
};

/**
 * Retorna a label de contagem (1 item / N itens).
 */
export const getCountLabel = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};
