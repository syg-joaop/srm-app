/**
 * Utilitários consolidados para mapeamento de status para variantes visuais.
 * Single source of truth para todas as operações de status mapping.
 */

import type { Variant } from "~/components/ui/badge.types";

/**
 * Tipos de variantes de status disponíveis.
 */
export type StatusVariant = Variant;

/**
 * Mapeamento de status para variantes visuais.
 * Substitui múltiplos STATUS_MAP/VARIANT_MAP hardcoded em componentes.
 */
const VARIANT_MAP: Record<string, StatusVariant> = {
  // Success variants
  ativo: "success",
  active: "success",
  concluido: "success",
  concluído: "success",
  completed: "success",
  final: "success",
  finalizado: "success",
  ok: "success",

  // Warning variants
  pendente: "warning",
  pending: "warning",
  vencido: "warning",
  overdue: "warning",
  agendado: "warning",
  scheduled: "warning",

  // Danger variants
  inativo: "danger",
  inactive: "danger",
  cancelado: "danger",
  cancelada: "danger",
  cancelled: "danger",

  // Info variants
  confirmado: "info",
  confirmed: "info",
  "em andamento": "info",
  "em_andamento": "info",
  "in progress": "info",
  acompanhamento: "info",

  // Primary variants
  aberto: "primary",
  open: "primary",
};

/**
 * Normaliza um valor de status para matching.
 */
function normalizeStatus(status: string | undefined | null): string {
  return (status || "").toLowerCase().trim().replace(/\s+/g, "_");
}

/**
 * Retorna a variante visual apropriada para um status.
 * Usa normalização de texto para matching flexível.
 *
 * @param status - Status a ser convertido
 * @returns Variant do badge
 */
export function getStatusVariant(status: string | undefined | null): StatusVariant {
  const normalized = normalizeStatus(status);

  if (!normalized) {
    return "default";
  }

  // Tenta match exato primeiro
  if (normalized in VARIANT_MAP) {
    return VARIANT_MAP[normalized];
  }

  // Tenta matching por inclusão (fallback)
  if (normalized.includes("inativo") || normalized.includes("cancel")) {
    return "danger";
  }
  if (normalized.includes("pendente") || normalized.includes("vencido")) {
    return "warning";
  }
  if (
    normalized.includes("ativo") ||
    normalized.includes("conclu") ||
    normalized.includes("final")
  ) {
    return "success";
  }
  if (normalized.includes("andamento") || normalized.includes("acompanhamento")) {
    return "info";
  }
  if (normalized.includes("aberto")) {
    return "primary";
  }

  return "default";
}

/**
 * Retorna a classe CSS completa para o badge de status baseado no status.
 * Inclui cores de background, texto e borda.
 *
 * @param status - String de status
 * @returns Classes CSS completas para o badge
 */
export function getStatusBadgeClass(status: string | undefined | null): string {
  const variant = getStatusVariant(status);

  const variantClasses: Record<StatusVariant, string> = {
    success:
      "bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]",
    warning:
      "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]",
    danger:
      "bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-[var(--color-danger)]",
    primary:
      "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]",
    info: "bg-[var(--color-info-soft)] text-[var(--color-info)] border-[var(--color-info)]",
    neutral:
      "bg-[var(--color-hover)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]",
    default:
      "bg-[var(--color-hover)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]",
  };

  return variantClasses[variant] || variantClasses.default;
}

/**
 * Retorna a classe CSS para o background color de status (barras laterais).
 *
 * @param status - String de status
 * @returns Classe CSS para background
 */
export function getStatusBgClass(status: string | undefined | null): string {
  const variant = getStatusVariant(status);

  const bgClasses: Record<StatusVariant, string> = {
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]",
    primary: "bg-[var(--color-primary)]",
    info: "bg-[var(--color-info)]",
    neutral: "bg-[var(--color-text-muted)]",
    default: "bg-[var(--color-text-muted)]",
  };

  return bgClasses[variant] || bgClasses.default;
}

/**
 * Retorna a classe CSS para o dot/indicador de status.
 *
 * @param status - String de status
 * @returns Classe CSS para o dot
 */
export function getStatusDotClass(status: string | undefined | null): string {
  const variant = getStatusVariant(status);

  const dotClasses: Record<StatusVariant, string> = {
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]",
    primary: "bg-[var(--color-primary)]",
    info: "bg-[var(--color-info)]",
    neutral: "bg-[var(--color-text-muted)]",
    default: "bg-[var(--color-text-muted)]",
  };

  return dotClasses[variant] || dotClasses.default;
}

/**
 * Retorna a cor hexadecimal para um status.
 *
 * @param status - String de status
 * @returns Cor em formato hexadecimal ou CSS variable
 */
export function getStatusColor(status: string | undefined | null): string {
  const variant = getStatusVariant(status);

  const colors: Record<StatusVariant, string> = {
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
    primary: "var(--color-primary)",
    info: "var(--color-info)",
    neutral: "var(--color-text-muted)",
    default: "var(--color-text-muted)",
  };

  return colors[variant] || colors.default;
}

/**
 * Retorna o label padronizado para um status.
 * Aplica capitalização e normalização.
 *
 * @param status - String de status
 * @returns Label formatado
 */
export function getStatusLabel(status: string | undefined | null): string {
  if (!status) return "-";

  const normalized = status.toLowerCase().trim();

  // Mapeamento específico para labels mais amigáveis
  const labelMap: Record<string, string> = {
    aguardando: "Aguardando",
    pendente: "Pendente",
    acompanhamento: "Em Acompanhamento",
    "em acompanhamento": "Em Acompanhamento",
    em_andamento: "Em Andamento",
    "em andamento": "Em Andamento",
    concluida: "Concluída",
    concluída: "Concluída",
    concluido: "Concluído",
    cancelada: "Cancelada",
    cancelado: "Cancelado",
    ativo: "Ativo",
    inativo: "Inativo",
  };

  return labelMap[normalized] || status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Alias de compatibilidade para uso em componentes Vue.
 * Mantém consistência com código existente.
 */
export const getVariant = getStatusVariant;
