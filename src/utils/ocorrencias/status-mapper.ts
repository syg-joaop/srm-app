/**
 * Mapeamento de status específico para ocorrências.
 *
 * @deprecated A maior parte da funcionalidade foi movida para ~/utils/status-helpers.
 * Este arquivo é mantido para backward compatibility e para o tipo OcorrenciaStatus específico.
 */

import { getStatusVariant, getStatusLabel, getStatusBadgeClass } from "~/utils/status-helpers";

import type { OcorrenciaStatus } from "~/server/schemas/ocorrencias.schema";

/**
 * Mapeia diversos valores de status para os três status padronizados de ocorrências.
 *
 * @param statusValue - Valor de status em qualquer formato
 * @returns Status padronizado (pendente, acompanhamento, concluida)
 */
export function mapStatus(statusValue: string | unknown): OcorrenciaStatus {
  const normalized = (statusValue ?? "").toString().toLowerCase().trim();

  // Status de acompanhamento
  if (["acompanhamento", "em acompanhamento", "andamento", "em andamento"].includes(normalized)) {
    return "acompanhamento";
  }

  // Status concluídos
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

  // Padrão: pendente
  return "pendente";
}

/**
 * Retorna a configuração de estilo para um status de ocorrência.
 *
 * @param status - Status da ocorrência
 * @returns Objeto com cor, label e classe CSS
 *
 * @deprecated Use getStatusLabel e getStatusBadgeClass de ~/utils/status-helpers.
 */
export function getStatusConfig(status: OcorrenciaStatus) {
  const configs: Record<
    OcorrenciaStatus,
    { color: string; label: string; className: string }
  > = {
    pendente: {
      color: "#f59e0b",
      label: "Pendente",
      className: "status-pendente",
    },
    acompanhamento: {
      color: "#3b82f6",
      label: "Em Acompanhamento",
      className: "status-acompanhamento",
    },
    concluida: {
      color: "#10b981",
      label: "Concluída",
      className: "status-concluida",
    },
  };

  return configs[status] || configs.pendente;
}

/**
 * Normaliza um valor de status para garantir que seja um OcorrenciaStatus válido.
 *
 * @param statusValue - Valor de status em qualquer formato
 * @returns Status validado
 */
export function normalizeStatus(statusValue: string | unknown): OcorrenciaStatus {
  const mapped = mapStatus(statusValue);

  // Valida se o resultado é um OcorrenciaStatus válido
  const validStatuses: OcorrenciaStatus[] = ["pendente", "acompanhamento", "concluida"];

  if (validStatuses.includes(mapped)) {
    return mapped;
  }

  return "pendente";
}
