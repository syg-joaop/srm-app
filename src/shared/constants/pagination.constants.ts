/**
 * Pagination Constants - Constantes compartilhadas de paginação
 */

// =============================================================================
// PAGINAÇÃO PADRÃO
// =============================================================================

export const PAGINACAO_PADRAO = {
  page: 1,
  itemsPerPage: 50,
} as const;

export type PaginacaoPadrao = typeof PAGINACAO_PADRAO;
