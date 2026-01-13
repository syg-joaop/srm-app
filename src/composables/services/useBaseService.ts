import { useApiConfig } from "../config";
import { useTypedHttpClient } from "../http";

import type { Ambiente } from "~/layers/common/schemas";

/**
 * Composable base para serviços de domínio
 *
 * Fornece cliente HTTP tipado configurado para a API.
 * Todos os serviços de domínio devem usar este composable como base.
 *
 * @param ambiente - Ambiente específico (opcional, usa ambiente atual)
 *
 * @example
 * ```ts
 * // Em um serviço específico
 * export const useParceiroService = () => {
 *   const { client } = useBaseService()
 *
 *   const getParceiro = (id: number) => {
 *     return client.get(`/parceiros/${id}`, parceiroSchema)
 *   }
 *
 *   return { getParceiro }
 * }
 * ```
 */
export const useBaseService = (ambiente?: Ambiente) => {
  const { getApiUrl } = useApiConfig();

  // Obtém URL da API
  const baseURL = getApiUrl(ambiente);

  // Cria cliente HTTP tipado
  const client = useTypedHttpClient(baseURL);

  return {
    client,
    baseURL,
  };
};
