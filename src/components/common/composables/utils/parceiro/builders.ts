/**
 * Funções para construção de TabItems a partir de dados brutos.
 * Responsável por transformar records em objetos estruturados para exibição.
 */

import {
  buildListDetails,
  buildStandardDetails,
  buildSubtitleSpecial,
  getExcludedKeys,
} from "./carga-helpers";
import {
  ALL_TABS,
  CADASTRO_FIELDS,
  CARGA_FIELDS,
  CONTATO_FIELDS,
  TAB_FIELD_CONFIG,
} from "./config";
import { formatDetailValue, normalize, toLabel } from "./normalizers";

import type { Carga } from "~/layers/common/schemas";
import type { DetailPair, EnhancedDetail, FieldMapping, TabId, TabItem } from "~/components/ui/ui.types";

// IMPORT ESM (substituindo require())

/**
 * Seleciona o primeiro campo disponível de uma lista.
 * @param record - Registro contendo os dados
 * @param fields - Lista de campos a tentar (em ordem de prioridade)
 * @returns Objeto com chave e valor encontrados
 */
const pickField = (
  record: Record<string, unknown>,
  fields: string[],
): { key: string; value: string } => {
  for (const field of fields) {
    const value = record[field];
    if (value) {
      const normalized = normalize(value);
      if (normalized) {
        return { key: field, value: normalized };
      }
    }
  }
  return { key: "", value: "" };
};

/**
 * Obtém o título para um registro baseado na configuração da tab.
 * @param record - Registro contendo os dados
 * @param tabId - Identificador da tab
 * @returns Objeto com chave e valor do título
 */
const getTitle = (
  record: Record<string, unknown>,
  tabId: TabId,
): { key: string; value: string } => {
  const config = TAB_FIELD_CONFIG[tabId];
  return pickField(record, config.title);
};

/**
 * Obtém o subtítulo para um registro baseado na configuração da tab.
 * @param record - Registro contendo os dados
 * @param tabId - Identificador da tab
 * @param titleKey - Chave usada no título (para evitar duplicação)
 * @returns Objeto com chave e valor do subtítulo
 */
const getSubtitle = (
  record: Record<string, unknown>,
  tabId: TabId,
  titleKey: string,
): { key: string; value: string } => {
  // Tratamento especial para cargas usando helper importado
  if (tabId === "cargas") {
    const cargaSubtitle = buildSubtitleSpecial(record);
    if (cargaSubtitle.value) return cargaSubtitle;
  }

  const config = TAB_FIELD_CONFIG[tabId];
  const result = pickField(record, config.subtitle);

  // Evita duplicar o título no subtítulo
  if (result.key === titleKey) {
    return { key: "", value: "" };
  }

  return result;
};

/**
 * Obtém o status para um registro baseado na configuração da tab.
 * @param record - Registro contendo os dados
 * @param tabId - Identificador da tab
 * @returns String com o status ou vazio se não houver
 */
const getStatus = (record: Record<string, unknown>, tabId: TabId): string => {
  const config = TAB_FIELD_CONFIG[tabId];
  if (!config.status) return "";

  const result = pickField(record, config.status);
  return result.value;
};

/**
 * Constrói detalhes a partir de um mapeamento de campos.
 * @param record - Registro contendo os dados
 * @param fields - Lista de campos mapeados
 * @returns Array de pares label-valor
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
 * Constrói um TabItem para a tab de cadastro.
 * @param record - Registro contendo os dados de cadastro
 * @returns Array com um TabItem ou array vazio se não houver dados
 */
export const buildCadastro = (record: Record<string, unknown>): TabItem[] => {
  const enderecoCompleto = [normalize(record.ende), normalize(record.comp)]
    .filter(Boolean)
    .join(", ");
  const enriched = { ...record, enderecoCompleto } as Record<string, unknown>;
  const details = buildDetailsFromFields(enriched, CADASTRO_FIELDS);
  const title = pickValue(enriched, ["name", "fornecedor", "nome", "titulo"]).value;
  const subtitle = pickValue(enriched, ["fanta", "fantasia", "location", "cidade"]).value;
  const status = pickValue(enriched, ["status", "situacao"]).value;
  const hasAny = details.length || title || subtitle || status;
  if (!hasAny) return [];
  const id = normalize(enriched.codfor) || normalize(enriched.id) || "cadastro";
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

/**
 * Constrói um TabItem para a tab de contatos.
 * @param record - Registro contendo os dados de contato
 * @returns Array com um TabItem ou array vazio se não houver dados
 */
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

/**
 * Constrói um TabItem de fallback para cargas (formato simplificado).
 * @param record - Registro contendo os dados de carga
 * @returns Array com um TabItem ou array vazio se não houver dados
 */
export const buildCargaFallback = (record: Record<string, unknown>): TabItem[] => {
  const details = buildDetailsFromFields(record, CARGA_FIELDS);
  const hasAny = details.length;
  if (!hasAny) return [];
  const id = normalize(record.codfor) || normalize(record.id) || "cargas";
  return [
    {
      id: `cargas-${id}`,
      title: "Resumo de cargas",
      subtitle: pickValue(record, ["fornecedor", "name", "nome"]).value || undefined,
      details,
    },
  ];
};

/**
 * Constrói TabItems para múltiplas cargas.
 * @param items - Array de itens de carga
 * @returns Array de TabItems
 */
export const buildCargas = (items: Carga[]): TabItem[] => {
  return items
    .map((item, idx) => buildCargaItem(item, idx))
    .filter((item): item is TabItem => item !== null);
};

/**
 * Constrói um TabItem individual para uma carga.
 * @param item - Item de carga
 * @param idx - Índice do item na lista
 * @returns TabItem ou null se inválido
 */
const buildCargaItem = (item: Carga, idx: number): TabItem | null => {
  const record = item as Record<string, unknown>;

  if (!record || typeof record !== "object") {
    return createFallback(idx);
  }

  const title = getTitle(record, "cargas");
  const isBatch = hasMultipleProducts(record);

  const details = buildDetailsForCarga(record, title.key, isBatch);

  const subtitle = buildSubtitleForCarga(record, isBatch);

  return {
    id: generateIdForRecord(record, idx),
    title: title.value || `Carga ${idx + 1}`,
    subtitle: subtitle || undefined,
    rightLabel: normalize(record.data_peso),
    details: details.slice(0, 8),
    detailsLayout: isBatch ? "list" : ("grid" as const),
  };
};

/**
 * Cria um TabItem de fallback para cargas inválidas.
 * @param idx - Índice do item
 * @returns TabItem básico de fallback
 */
const createFallback = (idx: number): TabItem => ({
  id: `cargas-${idx}`,
  title: `Carga ${idx + 1}`,
  details: [],
});

/**
 * Verifica se o registro tem múltiplos produtos.
 * @param record - Registro de carga
 * @returns true se count > 1
 */
const hasMultipleProducts = (record: Record<string, unknown>): boolean => {
  const countVal = record.count;
  let count = 0;

  if (typeof countVal === "number") {
    count = countVal;
  } else if (typeof countVal === "string") {
    const parsed = parseInt(countVal);
    count = !isNaN(parsed) ? parsed : 0;
  }

  return count > 1;
};

/**
 * Constrói detalhes específicos para cargas.
 * @param record - Registro de carga
 * @param titleKey - Chave usada como título
 * @param isBatch - Se é um lote com múltiplos produtos
 * @returns Array de detalhes
 */
const buildDetailsForCarga = (
  record: Record<string, unknown>,
  titleKey: string,
  isBatch: boolean,
): EnhancedDetail[] => {
  // Usando helpers importados (ESM)
  if (isBatch) {
    return buildListDetails(record);
  }

  const excludedKeys = getExcludedKeys(titleKey, false);
  return buildStandardDetails(record, excludedKeys);
};

/**
 * Constrói subtítulo específico para cargas.
 * @param record - Registro de carga
 * @param isBatch - Se é um lote com múltiplos produtos
 * @returns Subtítulo formatado
 */
const buildSubtitleForCarga = (record: Record<string, unknown>, isBatch: boolean): string => {
  if (isBatch) {
    const countVal = record.count;
    let count = 0;

    if (typeof countVal === "number") {
      count = countVal;
    } else if (typeof countVal === "string") {
      const parsed = parseInt(countVal);
      count = !isNaN(parsed) ? parsed : 0;
    }

    return `${count} produtos`;
  }

  const produtos = record.produto as string[] | undefined;
  if (produtos && Array.isArray(produtos) && produtos.length > 0) {
    return normalize(produtos[0]);
  }

  return "";
};

/**
 * Gera um ID único para um registro de carga.
 * @param record - Registro de carga
 * @param idx - Índice do item
 * @returns ID único
 */
const generateIdForRecord = (record: Record<string, unknown>, idx: number): string => {
  const boleto = normalize(record.boleto);
  const id = normalize(record.id);

  if (boleto) return `cargas-${boleto}`;
  if (id) return `cargas-${id}`;
  return `cargas-${idx}`;
};

/**
 * Seleciona o primeiro valor disponível de uma lista de chaves.
 * @param record - Registro contendo os dados
 * @param keys - Lista de chaves a tentar
 * @returns Objeto com chave e valor encontrados
 */
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

/**
 * Constrói TabItems genéricos para qualquer tipo de tab.
 * @param items - Array de itens para processar
 * @param tabId - Identificador da tab
 * @returns Array de TabItems
 */
export const build = (items: Record<string, unknown>[], tabId: TabId): TabItem[] => {
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

      const record = item;

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
