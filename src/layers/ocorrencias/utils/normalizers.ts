import { z } from "zod";

import { toNumber, toStringValue } from "~/utils/coerce";

import { ocorrenciaSchema } from "../schemas/ocorrencias.schema";

type Ocorrencia = z.infer<typeof ocorrenciaSchema>;
type OcorrenciaStatus = "pendente" | "acompanhamento" | "concluida";

const mapStatus = (statusValue: string | unknown): OcorrenciaStatus => {
  const normalized = (statusValue ?? "").toString().toLowerCase().trim();

  if (["acompanhamento", "em acompanhamento", "andamento", "em andamento"].includes(normalized)) {
    return "acompanhamento";
  }

  if (
    [
      "concluida",
      "concluído",
      "ok",
      "finalizada",
      "finalizado",
      "concluido",
      "resolvida",
      "resolvido",
    ].includes(normalized)
  ) {
    return "concluida";
  }

  return "pendente";
};

/**
 * Extrai um campo de um objeto tentando múltiplas chaves possíveis.
 *
 * @param raw - Objeto bruto com dados
 * @param possibleKeys - Array com chaves possíveis em ordem de prioridade
 * @param defaultValue - Valor padrão caso nenhuma chave seja encontrada
 * @returns Valor encontrado ou valor padrão
 */
function extractField(
  raw: Record<string, unknown>,
  possibleKeys: string[],
  defaultValue: string = "—",
): string {
  for (const key of possibleKeys) {
    const value = toStringValue(raw[key]);
    if (value) return value;
  }
  return defaultValue;
}

/**
 * Extrai um campo numérico de um objeto tentando múltiplas chaves possíveis.
 *
 * @param raw - Objeto bruto com dados
 * @param possibleKeys - Array com chaves possíveis em ordem de prioridade
 * @param defaultValue - Valor padrão caso nenhuma chave seja encontrada
 * @returns Valor encontrado ou valor padrão
 */
function extractNumber(
  raw: Record<string, unknown>,
  possibleKeys: string[],
  defaultValue: number,
): number {
  for (const key of possibleKeys) {
    const value = toNumber(raw[key]);
    if (value !== undefined) return value;
  }
  return defaultValue;
}

/**
 * Normaliza um objeto bruto de ocorrência para o tipo Ocorrencia.
 *
 * Esta função tenta extrair dados de múltiplas chaves possíveis,
 * tornando-a robusta a variações na API.
 *
 * @param raw - Objeto bruto da API
 * @returns Objeto Ocorrencia normalizado
 */
export function normalizeOcorrencia(raw: Record<string, unknown>): Ocorrencia {
  // Extrair status (usado múltiplas vezes, então extraímos primeiro)
  const statusValue =
    toStringValue(raw.status) ??
    toStringValue(raw.situacao) ??
    toStringValue(raw.status_ocorrencia) ??
    "pendente";

  return {
    // ID - tenta múltiplas chaves possíveis
    id: extractNumber(raw, ["id", "sr_recno", "codigo", "cod_ocorrencia"], Date.now()),

    // Título - vários campos possíveis
    titulo: extractField(raw, ["titulo", "titulo_ocorrencia", "assunto", "descricao"], undefined),

    // Fornecedor - vários campos possíveis
    fornecedor: extractField(raw, ["fornecedor", "empresa", "apelido", "nome_fornecedor"], "—"),

    // Data de cadastro - tenta múltiplos formatos
    dataCadastro: extractField(
      raw,
      ["dataCadastro", "data_cadastro", "data", "data_oco"],
      undefined,
    ),

    // Atendente - vários campos possíveis
    atendente: extractField(
      raw,
      ["atendente", "usuario", "atendente_nome", "atendenteResponsavel", "responsavel"],
      "—",
    ),

    // Status - mapeado para valores padronizados
    status: mapStatus(statusValue),

    // Próximo atendimento
    proximoAtendimento: extractField(
      raw,
      ["proximoAtendimento", "data_prox_atend", "proximo_atendimento"],
      undefined,
    ),

    // Encaminhado para
    encaminhadoPara: extractField(raw, ["encaminhadoPara", "encaminhado_para"], undefined),

    // Diagnosticado por
    diagnosticadoPor: extractField(raw, ["diagnosticadoPor", "diagnosticado_por"], undefined),

    // Forma de atendimento
    formaAtendimento: extractField(raw, ["formaAtendimento", "forma_atendimento"], undefined),

    // Situação (campo adicional)
    situacao: extractField(raw, ["situacao", "status"], undefined),
  };
}

/**
 * Normaliza um array de ocorrências brutas.
 *
 * @param rawItems - Array de objetos brutos
 * @returns Array de ocorrências normalizadas
 */
export function normalizeOcorrencias(rawItems: Record<string, unknown>[]): Ocorrencia[] {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .filter((item) => item != null && typeof item === "object")
    .map(normalizeOcorrencia);
}
