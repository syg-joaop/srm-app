/**
 * Composable para gerenciar status variants de parceiros.
 * Extrai lógica de mapeamento de status para variantes visuais.
 *
 * @deprecated Use getStatusVariant, getStatusBadgeClass, etc. de ~/utils/status-helpers diretamente.
 * Este composable é mantido para backward compatibility.
 */

import { getStatusVariant, getStatusBadgeClass, getStatusLabel, getStatusColor } from '~/utils/status-helpers';

import type { Variant } from '~/components/ui/badge.types';

// Re-export para backward compatibility
export const getVariant = getStatusVariant as (status: string) => Variant;

/**
 * Hook para usar status variants em componentes.
 *
 * @deprecated Use getStatusVariant, getStatusBadgeClass, etc. de ~/utils/status-helpers diretamente.
 */
export const useParceiroStatus = () => {
  return {
    getVariant: getStatusVariant,
    getStatusBadgeClass,
    getStatusLabel,
    getStatusColor,
  };
};
