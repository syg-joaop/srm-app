/**
 * Factory para criar services de listagem paginada.
 *
 * @example
 * ```ts
 * const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES";
 * export const useFornecedorService = () => {
 *   const { fetchList } = createListService<FornecedorResponse, FornecedorFilters>(ENDPOINT);
 *   return { fetchFornecedor: fetchList };
 * };
 * ```
 */

export const createListService = <T, F extends Record<string, unknown>>(endpoint: string) => {
  const api = useHttpClient();

  const fetchList = async (page = 1, size = 50, filters?: Partial<F>): Promise<T> => {
    const body = {
      page,
      size,
      offset: (page - 1) * size,
      ...filters,
    };
    return api.post<T>(endpoint, body);
  };

  return { fetchList };
};
