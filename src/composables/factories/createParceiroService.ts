/**
 * Factory para criar services de parceiros (fornecedores/prospectos) com funcionalidades padronizadas.
 *
 * Unifica o padrao de useFornecedorService e useProspectoService,
 * permitindo criar services de listagem paginada para diferentes tipos de parceiros.
 *
 * @example
 * ```ts
 * // Criar service de fornecedores
 * export const useFornecedorService = () => {
 *   return createParceiroService<FornecedorResponse, FornecedorFilters>({
 *     endpoint: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES",
 *     fetchMethodName: "fetchFornecedor",
 *   });
 * };
 *
 * // Criar service de prospectos
 * export const useProspectoService = () => {
 *   return createParceiroService<ProspectoResponse, ProspectoFilters>({
 *     endpoint: "/sygecom/chameleon-mode/SRM_GET_PROSPECTO",
 *     fetchMethodName: "fetchProspectos",
 *   });
 * };
 * ```
 */

import { createListService } from "./createListService";

// =============================================================================
// TIPOS
// =============================================================================

/**
 * Configuracao para criar um service de parceiro.
 */
interface ParceiroServiceConfig {
  /** Endpoint da API para buscar os dados */
  endpoint: string;

  /** Nome do metodo de fetch no retorno (ex: "fetchFornecedor", "fetchProspectos") */
  fetchMethodName: string;
}

/**
 * Tipo generico para o retorno do service.
 * Usa um Record dinamico para permitir nomes customizados de metodo.
 */
type ParceiroServiceReturn<T, F extends Record<string, unknown>> = {
  [key: string]: (page?: number, size?: number, filters?: Partial<F>) => Promise<T>;
};

// =============================================================================
// FACTORY
// =============================================================================

/**
 * Cria um service de parceiro com metodo de fetch configuravel.
 *
 * Esta factory encapsula o padrao comum de:
 * 1. Criar um listService com o endpoint
 * 2. Renomear o metodo fetchList para um nome especifico do dominio
 *
 * @param config - Configuracao do service
 * @returns Objeto com o metodo de fetch nomeado conforme config
 */
export function createParceiroService<T, F extends Record<string, unknown>>(
  config: ParceiroServiceConfig,
): ParceiroServiceReturn<T, F> {
  const { fetchList } = createListService<T, F>(config.endpoint);

  return {
    [config.fetchMethodName]: fetchList,
  };
}

// =============================================================================
// FACTORY TIPADA (ALTERNATIVA)
// =============================================================================

/**
 * Factory alternativa que retorna um objeto tipado com nome fixo.
 * Usa quando voce quer type-safety completo no nome do metodo.
 *
 * @example
 * ```ts
 * const { fetchParceiro } = createParceiroServiceTyped<Response, Filters>(
 *   "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES"
 * );
 * ```
 */
export function createParceiroServiceTyped<T, F extends Record<string, unknown>>(
  endpoint: string,
) {
  const { fetchList } = createListService<T, F>(endpoint);

  return {
    fetchParceiro: fetchList,
  };
}

export type { ParceiroServiceConfig, ParceiroServiceReturn };
