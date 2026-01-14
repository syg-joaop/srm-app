/**
 * Factory Detalhes paginados.
 *
 * @example
 * ```ts
 * const fetchPrecos = createDetailFetcher(ENDPOINTS.PRECO);
 * const result = await fetchPrecos("123", 1, 50);
 * ```
 */

export const createDetailFetcher = <T>(endpoint: string) => {
  const api = useHttpClient();

  return async (codfor: string, page = 1, size = 50): Promise<T> => {
    const body = {
      codfor,
      page,
      size,
      offset: (page - 1) * size,
    };
    return api.post<T>(endpoint, body);
  };
};
