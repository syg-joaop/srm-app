/**
 * Helpers para processamento de dados de parceiros.
 * VERSÃO SIMPLIFICADA - Sem lógica complexa de inferência.
 */

import type {
  DetailPair,
  EmptyStateCopy,
  EnhancedDetail,
  FieldMapping,
  ParceiroData,
  ParceiroVariant,
  TabId,
  TabItem,
  TabOption,
} from "~/types/parceiro";

/**
 * Configuração simples de campos por tab.
 * Define diretamente quais campos usar para título, subtítulo e status.
 * Simples, direto, sem "adivinhação".
 */
const TAB_FIELD_CONFIG: Record<TabId, { title: string[]; subtitle: string[]; status?: string[] }> = {
  cadastro: {
    title: ['fornecedor', 'name', 'nome'],
    subtitle: ['cidade', 'location', 'uf'],
  },
  contatos: {
    title: ['nome', 'name', 'contato'],
    subtitle: ['cargo', 'funcao', 'email', 'telefone'],
    status: ['tipo', 'principal'],
  },
  cargas: {
    title: ['boleto', 'numero', 'id'],
    subtitle: ['data_peso', 'data_carga', 'data'],
    status: ['situacao', 'status'],
  },
  agendamentos: {
    title: ['tipo', 'titulo', 'assunto'],
    subtitle: ['data', 'data_agend', 'hora'],
    status: ['situacao', 'confirmado'],
  },
  atendimentos: {
    title: ['tipo', 'titulo', 'assunto', 'sintoma'],
    subtitle: ['data', 'data_atend', 'atendente'],
    status: ['situacao', 'resultado'],
  },
  coletas: {
    title: ['numero', 'id', 'romaneio'],
    subtitle: ['data', 'cidade', 'peso'],
    status: ['situacao', 'coletado'],
  },
  precos: {
    title: ['produto', 'descricao'],
    subtitle: ['valor', 'preco'],
  },
  checkins: {
    title: ['local', 'endereco'],
    subtitle: ['data', 'hora'],
    status: ['situacao'],
  },
  favorecidos: {
    title: ['nome', 'name', 'favorecido'],
    subtitle: ['tipo', 'documento'],
  },
};

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

const pickField = (record: Record<string, unknown>, fields: string[]): { key: string; value: string } => {
  for (const field of fields) {
    const value = record[field];
    if (value) {
      const normalized = normalize(value);
      if (normalized) {
        return { key: field, value: normalized };
      }
    }
  }
  return { key: '', value: '' };
};

const getTitle = (record: Record<string, unknown>, tabId: TabId): { key: string; value: string } => {
  const config = TAB_FIELD_CONFIG[tabId];
  return pickField(record, config.title);
};

const getSubtitle = (
  record: Record<string, unknown>,
  tabId: TabId,
  titleKey: string
): { key: string; value: string } => {
  if (tabId === 'cargas') {
    const { buildSubtitleSpecial } = require('./carga-helpers');
    const cargaSubtitle = buildSubtitleSpecial(record);
    if (cargaSubtitle.value) return cargaSubtitle;
  }

  const config = TAB_FIELD_CONFIG[tabId];
  const result = pickField(record, config.subtitle);

  if (result.key === titleKey) {
    return { key: '', value: '' };
  }

  return result;
};

const getStatus = (record: Record<string, unknown>, tabId: TabId): string => {
  const config = TAB_FIELD_CONFIG[tabId];
  if (!config.status) return '';

  const result = pickField(record, config.status);
  return result.value;
};

export const normalize = (value: unknown): string => {
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

export const isISODate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value);
};

export const formatDate = (value: string): string => {
  if (!isISODate(value)) return value;

  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours === 0 && minutes === 0) {
      return `${day}/${month}/${year}`;
    }

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    return `${day}/${month}/${year} ${hoursStr}:${minutesStr}`;
  } catch {
    return value;
  }
};

export const formatDetailValue = (value: unknown): string => {
  const normalized = normalize(value);
  if (!normalized) return "-";

  if (typeof normalized === "string" && isISODate(normalized)) {
    return formatDate(normalized);
  }

  if (Array.isArray(value)) {
    const formatted = value
      .map((item) => normalize(item))
      .filter((v) => v && v !== "-")
      .slice(0, 5)
      .join(", ");

    if (value.length > 5) {
      return `${formatted} (+${value.length - 5})`;
    }
    return formatted || "-";
  }

  return normalized;
};

export const pickValue = (
  record: Record<string, unknown>,
  keys: readonly string[],
): { key: string; value: string } => {
  for (const key of keys) {
    const value = normalize(record[key]);
    if (value) return { key, value };
  }
  return { key: "", value: "" };
};

export const toLabel = (key: string): string => {
  const cleaned = key.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return key;
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

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

export const buildCadastro = (record: Record<string, unknown>): TabItem[] => {
  const enderecoCompleto = [
    normalize(record.ende),
    normalize(record.comp),
  ]
    .filter(Boolean)
    .join(", ");
  const enriched = { ...record, enderecoCompleto } as Record<string, unknown>;
  const details = buildDetailsFromFields(enriched, CADASTRO_FIELDS);
  const title = pickValue(enriched, ["name", "fornecedor", "nome", "titulo"]).value;
  const subtitle = pickValue(enriched, ["fanta", "fantasia", "location", "cidade"])
    .value;
  const status = pickValue(enriched, ["status", "situacao"]).value;
  const hasAny = details.length || title || subtitle || status;
  if (!hasAny) return [];
  const id =
    normalize(enriched.codfor) ||
    normalize(enriched.id) ||
    "cadastro";
  return [
    {
      id: `cadastro-${id}`,
      title: title || "Cadastro",
      subtitle: subtitle || undefined,
      status: status || undefined,
      details,
    },
  ];
};

export const buildContato = (record: Record<string, unknown>): TabItem[] => {
  const details = buildDetailsFromFields(record, CONTATO_FIELDS);
  const title = pickValue(record, ["name", "fornecedor", "nome"]).value;
  const subtitle = pickValue(record, ["fanta", "fantasia"]).value;
  const hasAny = details.length || title || subtitle;
  if (!hasAny) return [];
  const id = normalize(record.codfor) || normalize(record.id) || "contatos";
  return [
    {
      id: `contatos-${id}`,
      title: title || "Contato",
      subtitle: subtitle || undefined,
      details,
    },
  ];
};

export const buildCargaFallback = (record: Record<string, unknown>): TabItem[] => {
  const details = buildDetailsFromFields(record, CARGA_FIELDS);
  const hasAny = details.length;
  if (!hasAny) return [];
  const id =
    normalize(record.codfor) || normalize(record.id) || "cargas";
  return [
    {
      id: `cargas-${id}`,
      title: "Resumo de cargas",
      subtitle: pickValue(record, ["fornecedor", "name", "nome"]).value || undefined,
      details,
    },
  ];
};

export const buildCargas = (items: unknown[]): TabItem[] => {
  return items
    .map((item, idx) => buildCargaItem(item, idx))
    .filter((item): item is TabItem => item !== null);
};

const buildCargaItem = (item: unknown, idx: number): TabItem | null => {
  if (!item || typeof item !== 'object') {
    return createFallback(idx);
  }

  const record = item as Record<string, unknown>;

  const title = getTitle(record, 'cargas');
  const isBatch = hasMultipleProducts(record);

  const details = buildDetailsForCarga(record, title.key, isBatch);

  const subtitle = buildSubtitleForCarga(record, isBatch);

  return {
    id: generateIdForRecord(record, idx),
    title: title.value || `Carga ${idx + 1}`,
    subtitle: subtitle || undefined,
    rightLabel: normalize(record.data_peso),
    details: details.slice(0, 8),
    detailsLayout: isBatch ? 'list' : 'grid' as const,
  };
};

const createFallback = (idx: number): TabItem => ({
  id: `cargas-${idx}`,
  title: `Carga ${idx + 1}`,
  details: [],
});

const hasMultipleProducts = (record: Record<string, unknown>): boolean => {
  const countVal = record.count;
  let count = 0;

  if (typeof countVal === 'number') {
    count = countVal;
  } else if (typeof countVal === 'string') {
    const parsed = parseInt(countVal);
    count = !isNaN(parsed) ? parsed : 0;
  }

  return count > 1;
};

const buildDetailsForCarga = (
  record: Record<string, unknown>,
  titleKey: string,
  isBatch: boolean
): EnhancedDetail[] => {
  const { buildListDetails, buildStandardDetails, getExcludedKeys } = require('./carga-helpers');

  if (isBatch) {
    return buildListDetails(record);
  }

  const excludedKeys = getExcludedKeys(titleKey, false);
  return buildStandardDetails(record, excludedKeys);
};

const buildSubtitleForCarga = (
  record: Record<string, unknown>,
  isBatch: boolean
): string => {
  if (isBatch) {
    const countVal = record.count;
    let count = 0;

    if (typeof countVal === 'number') {
      count = countVal;
    } else if (typeof countVal === 'string') {
      const parsed = parseInt(countVal);
      count = !isNaN(parsed) ? parsed : 0;
    }

    return `${count} produtos`;
  }

  const produtos = record.produto as string[] | undefined;
  if (produtos && Array.isArray(produtos) && produtos.length > 0) {
    return normalize(produtos[0]);
  }

  return '';
};

const generateIdForRecord = (record: Record<string, unknown>, idx: number): string => {
  const boleto = normalize(record.boleto);
  const id = normalize(record.id);

  if (boleto) return `cargas-${boleto}`;
  if (id) return `cargas-${id}`;
  return `cargas-${idx}`;
};

export const build = (items: unknown[], tabId: TabId): TabItem[] => {
  const tabLabelById = ALL_TABS.reduce(
    (acc, tab) => {
      acc[tab.id] = tab.label;
      return acc;
    },
    {} as Record<TabId, string>,
  );

  const fallbackLabel = tabLabelById[tabId] || "Item";

  return items
    .map((item, idx) => {
      if (!item || typeof item !== "object") {
        const value = normalize(item);
        return {
          id: `${tabId}-${idx}`,
          title: value || `${fallbackLabel} ${idx + 1}`,
          details: [],
        };
      }

      const record = item as Record<string, unknown>;

      const title = getTitle(record, tabId);
      const subtitle = getSubtitle(record, tabId, title.key);
      const status = getStatus(record, tabId);

      const excludedKeys = [title.key, subtitle.key].filter(Boolean);

      const details = Object.entries(record)
        .filter(([key]) => !excludedKeys.includes(key))
        .filter(([, value]) => {
          if (value === null || value === undefined) return false;
          if (Array.isArray(value)) return false;
          return ["string", "number", "boolean"].includes(typeof value);
        })
        .map(([key, value]) => {
          const formattedValue = formatDetailValue(value);
          if (!formattedValue || formattedValue === "-") return null;
          return {
            label: toLabel(key),
            value: formattedValue,
          };
        })
        .filter((detail): detail is DetailPair => Boolean(detail))
        .slice(0, 6);

      const id =
        normalize(record.id) ||
        normalize(record.codigo) ||
        normalize(record.codfor) ||
        `${tabId}-${idx}`;

      return {
        id: `${tabId}-${id}`,
        title: title.value || `${fallbackLabel} ${idx + 1}`,
        subtitle: subtitle.value || undefined,
        status: status || undefined,
        details,
      };
    })
    .filter((item) => item.title || item.details.length || item.status || item.subtitle);
};

export const getStatusBadgeClass = (status?: string): string => {
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

export const filterTabs = (
  variant: ParceiroVariant,
): TabOption[] => {
  if (variant === "atendente" || variant === "time") {
    return ALL_TABS.filter((t) => ["agendamentos", "atendimentos", "checkins"].includes(t.id));
  }
  return ALL_TABS.filter((t) => t.id !== "agendamentos");
};

export const getInitialTab = (variant: ParceiroVariant): TabId => {
  if (variant === "atendente" || variant === "time") {
    return "agendamentos";
  }
  return "atendimentos";
};

export const isParceiroInactive = (parceiro: ParceiroData | null): boolean => {
  return (parceiro?.status || "").toLowerCase().trim() === "inativo";
};

export const getTabLabel = (tabId: TabId): string => {
  return ALL_TABS.find((t) => t.id === tabId)?.label || "";
};

export const getCountLabel = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};

// Field mapping constants
const CADASTRO_FIELDS: FieldMapping[] = [
  { key: "codfor", label: "Código" },
  { key: "fornecedor", label: "Nome" },
  { key: "nome", label: "Nome" },
  { key: "fanta", label: "Fantasia" },
  { key: "ende", label: "Endereço" },
  { key: "bairro", label: "Bairro" },
  { key: "cidade", label: "Cidade" },
  { key: "uf", label: "UF" },
  { key: "cpf", label: "CPF" },
  { key: "cnpj", label: "CNPJ" },
  { key: "rg", label: "RG" },
  { key: "ie", label: "IE" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail" },
  { key: "contato", label: "Contato" },
  { key: "tipo", label: "Tipo" },
  { key: "status", label: "Status" },
  { key: "situacao", label: "Situação" },
];

const CONTATO_FIELDS: FieldMapping[] = [
  { key: "nome", label: "Nome" },
  { key: "cargo", label: "Cargo" },
  { key: "funcao", label: "Função" },
  { key: "email", label: "E-mail" },
  { key: "telefone", label: "Telefone" },
  { key: "celular", label: "Celular" },
  { key: "tipo", label: "Tipo" },
  { key: "principal", label: "Principal" },
  { key: "observacao", label: "Observação" },
];

const CARGA_FIELDS: FieldMapping[] = [
  { key: "boleto", label: "Boleto" },
  { key: "numero", label: "Número" },
  { key: "data_peso", label: "Data" },
  { key: "data_carga", label: "Data da Carga" },
  { key: "fornecedor", label: "Fornecedor" },
  { key: "count", label: "Quantidade" },
  { key: "situacao", label: "Situação" },
  { key: "status", label: "Status" },
];
