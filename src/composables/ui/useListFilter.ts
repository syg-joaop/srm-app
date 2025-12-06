import { ref, computed, unref } from 'vue';
import type { Ref, MaybeRef } from 'vue';

export interface FilterConfig<T> {
  /** Campos para busca textual simples */
  searchFields?: (keyof T)[];
  /** Função para filtros customizados complexos */
  customFilters?: (item: T) => boolean;
  /** Função de ordenação */
  sortCompare?: (a: T, b: T) => number;
}

/**
 * Composable genérico para filtrar e ordenar listas.
 * @param items Ref para o array de itens original
 * @param config Configuração de filtros e ordenação (pode ser reativa)
 */
export function useListFilter<T>(
  items: Ref<T[] | undefined | null>,
  config: MaybeRef<FilterConfig<T>>
) {
  const search = ref('');

  const filteredItems = computed(() => {
    const list = items.value || [];
    const conf = unref(config);
    const term = search.value.trim().toLowerCase();

    // 1. Filtragem
    let result = list.filter(item => {
      // Busca textual
      let matchesSearch = true;
      if (term && conf.searchFields) {
        matchesSearch = conf.searchFields.some(field => {
          const val = item[field];
          return String(val ?? '').toLowerCase().includes(term);
        });
      }

      // Filtros customizados
      let matchesCustom = true;
      if (conf.customFilters) {
        matchesCustom = conf.customFilters(item);
      }

      return matchesSearch && matchesCustom;
    });

    // 2. Ordenação
    if (conf.sortCompare) {
      result = [...result].sort(conf.sortCompare);
    }

    return result;
  });

  return {
    search,
    filteredItems
  };
}
