/**
 * Composable para gerenciar status variants de parceiros.
 * Extrai lógica de mapeamento de status para variantes visuais.
 */

import type { Variant } from '~/components/ui/UiBadge.vue';

/**
 * Mapeamento de status para variantes visuais.
 * Substitui o STATUS_MAP hardcoded em componentes.
 */
const VARIANT_MAP: Record<string, Variant> = {
  ativo: 'success',
  active: 'success',
  concluido: 'success',
  completed: 'success',
  pendente: 'warning',
  pending: 'warning',
  vencido: 'warning',
  overdue: 'warning',
  agendado: 'warning',
  scheduled: 'warning',
  inativo: 'danger',
  inactive: 'danger',
  cancelado: 'danger',
  cancelled: 'danger',
  confirmado: 'info',
  confirmed: 'info',
  'em andamento': 'info',
  'in progress': 'info',
  aberto: 'primary',
  open: 'primary',
};

/**
 * Retorna a variante visual apropriada para um status.
 * Usa normalização de texto para matching flexível.
 *
 * @param status - Status a ser convertido
 * @returns Variant do badge
 */
export const getVariant = (status: string): Variant => {
  if (!status) return 'default';

  const normalized = status.toLowerCase().trim();

  // Tenta match exato primeiro
  if (normalized in VARIANT_MAP) {
    return VARIANT_MAP[normalized];
  }

  // Tenta matching por inclusão
  for (const [key, variant] of Object.entries(VARIANT_MAP)) {
    if (normalized.includes(key)) {
      return variant;
    }
  }

  return 'default';
};

/**
 * Hook para usar status variants em componentes.
 */
export const useParceiroStatus = () => {
  return {
    getVariant,
  };
};
