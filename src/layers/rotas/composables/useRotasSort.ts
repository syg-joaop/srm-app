import { SORT_VALUE_EXTRACTORS, type SortField, type SortOrder } from "../constants/rota.constants";

import type { Rota } from "../schemas/rotas.schema";

/**
 * Composable para gerenciar ordenação de rotas
 *
 * Usa objeto de mapeamento ao invés de switch/case.
 */
export function useRotasSort() {
  const sortField = ref<SortField | null>(null);
  const sortOrder = ref<SortOrder>("asc");

  /**
   * Toggle de ordenação por campo
   */
  const toggleSort = (field: SortField) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortField.value = field;
      sortOrder.value = "asc";
    }
  };

  /**
   * Verifica se um campo está ativo em uma direção específica
   */
  const isSortActive = (field: SortField, order: SortOrder) =>
    sortField.value === field && sortOrder.value === order;

  /**
   * Aplica ordenação em uma lista de rotas
   */
  const sortRotas = (rotas: Rota[]): Rota[] => {
    if (!sortField.value) return rotas;

    const extractor = SORT_VALUE_EXTRACTORS[sortField.value];
    const sorted = [...rotas].sort((a, b) => {
      const valueA = extractor(a);
      const valueB = extractor(b);

      if (valueA > valueB) return 1;
      if (valueA < valueB) return -1;
      return 0;
    });

    return sortOrder.value === "desc" ? sorted.reverse() : sorted;
  };

  return {
    sortField,
    sortOrder,
    toggleSort,
    isSortActive,
    sortRotas,
  };
}
