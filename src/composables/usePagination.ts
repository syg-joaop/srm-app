/**
 * Composable para paginação de listas.
 * Fornece lógica de paginação reativa com controle de itens por página.
 */

export function usePagination<T>(items: MaybeRefOrGetter<T[]>, initialItemsPerPage: number = 10) {
  const currentPage = ref(1);
  const itemsPerPage = ref(initialItemsPerPage);

  const itemsArray = computed(() => toValue(items));

  /**
   * Calcula o total de páginas baseado na quantidade de itens.
   */
  const totalPages = computed(() => {
    if (!itemsArray.value.length) return 1;
    return Math.ceil(itemsArray.value.length / itemsPerPage.value);
  });

  /**
   * Retorna os itens da página atual como computed.
   */
  const paginatedItems = computed(() => {
    if (!itemsArray.value.length) return [];

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;

    return itemsArray.value.slice(startIndex, endIndex);
  });

  /**
   * Retorna os itens da página atual (método para backward compatibility).
   */
  const getPaginatedItems = (): T[] => {
    return paginatedItems.value;
  };

  /**
   * Navega para uma página específica.
   */
  const goToPage = (page: number) => {
    currentPage.value = page;
  };

  /**
   * Avança para a próxima página.
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  /**
   * Volta para a página anterior.
   */
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  /**
   * Reinicia a paginação.
   */
  const reset = () => {
    currentPage.value = 1;
  };

  /**
   * Atualiza a quantidade de itens por página e reinicia.
   */
  const setItemsPerPage = (count: number) => {
    itemsPerPage.value = count;
    reset();
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    getPaginatedItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
    setItemsPerPage,
  };
}
