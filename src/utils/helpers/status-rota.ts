/**
 * Utilitários específicos para status de rotas.
 *
 * @deprecated Use getStatusVariant, getStatusLabel, getStatusColor de ~/utils/status-helpers.
 * Este arquivo é mantido para backward compatibility.
 */

import { getStatusVariant, getStatusLabel, getStatusColor } from "~/utils/status-helpers";

export type RotaStatusVariant = "default" | "primary" | "success" | "warning" | "danger";

interface StatusConfig {
  label: string;
  color: string;
  variant: RotaStatusVariant;
}

const ROTA_STATUS_MAP: Record<string, StatusConfig> = {
  aguardando: { label: "Aguardando", color: "var(--color-text-muted)", variant: "default" },
  pendente: { label: "Pendente", color: "var(--color-warning)", variant: "warning" },
  em_andamento: { label: "Em Andamento", color: "var(--color-primary)", variant: "primary" },
  "em andamento": { label: "Em Andamento", color: "var(--color-primary)", variant: "primary" },
  concluida: { label: "Concluída", color: "var(--color-success)", variant: "success" },
  concluída: { label: "Concluída", color: "var(--color-success)", variant: "success" },
  cancelada: { label: "Cancelada", color: "var(--color-danger)", variant: "danger" },
  cancelado: { label: "Cancelado", color: "var(--color-danger)", variant: "danger" },
};

/**
 * Retorna a configuração completa de status para rotas.
 *
 * @deprecated Use getStatusLabel, getStatusColor, getStatusVariant de ~/utils/status-helpers.
 */
export const getRotaStatusConfig = (status?: string): StatusConfig => {
  const normalized = (status || "").toLowerCase().trim();

  if (normalized in ROTA_STATUS_MAP) {
    return ROTA_STATUS_MAP[normalized];
  }

  // Fallback para o utilitário consolidado
  return {
    label: getStatusLabel(status),
    color: getStatusColor(status),
    variant: getStatusVariant(status) as RotaStatusVariant,
  };
};

/**
 * @deprecated Use getStatusLabel de ~/utils/status-helpers.
 */
export const getRotaStatusLabel = (status?: string): string => getRotaStatusConfig(status).label;

/**
 * @deprecated Use getStatusColor de ~/utils/status-helpers.
 */
export const getRotaStatusColor = (status?: string): string => getRotaStatusConfig(status).color;

/**
 * @deprecated Use getStatusVariant de ~/utils/status-helpers.
 */
export const getRotaStatusVariant = (status?: string): RotaStatusVariant =>
  getRotaStatusConfig(status).variant;
