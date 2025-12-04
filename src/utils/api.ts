/**
 * Utils de API - Cliente HTTP Centralizado
 *
 * Fornece clientes $fetch configurados para diferentes bases de API.
 * Injeta automaticamente headers de autenticação e secret.
 *
 * @example
 * // Para API v2 (SRM Dashboard, etc)
 * const api = useMainApi()
 * const data = await api<ResponseType>('/endpoint', { method: 'GET' })
 *
 * @example
 * // Para API de autenticação
 * const authApi = useAuthApi()
 * const user = await authApi<User>('/login', { method: 'POST', body: {...} })
 */

import type { $Fetch } from "ofetch";

/**
 * Cria um cliente $fetch configurado com interceptors
 * @param baseURL - URL base da API
 */
const createApiClient = (baseURL: string): $Fetch => {
  const config = useRuntimeConfig();
  const secret = config.public.apiSecret as string;

  return $fetch.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    onRequest({ options }) {
      const authStore = useAuthStore();

      // Prepara headers dinâmicos
      const headers: Record<string, string> = {};

      // Adiciona x-secret se disponível
      if (secret) {
        headers["x-secret"] = secret;
      }

      // Adiciona token de autenticação se usuário logado
      if (authStore.user?.token) {
        headers["Authorization"] = `Bearer ${authStore.user.token}`;
      }

      options.headers = {
        ...options.headers,
        ...headers,
      };
    },
    onResponseError({ response }) {
      // Log de erros para debug
      console.error(`[API Error] ${response.status}`, {
        url: response.url,
        data: response._data,
      });

      // TODO: Adicionar tratamento global de erros 401 (redirect para login)
      // TODO: Adicionar tratamento global de erros 403, 500, etc.
    },
  });
};

/**
 * Cliente API para endpoints v2 (Dashboard, SRM, etc.)
 * Base URL: apiV2Url do .env
 */
export const useMainApi = () => {
  const config = useRuntimeConfig();
  return createApiClient(config.public.apiV2Url as string);
};

/**
 * Cliente API para endpoints de autenticação
 * Base URL: apiBaseUrl do .env
 */
export const useAuthApi = () => {
  const config = useRuntimeConfig();
  return createApiClient(config.public.apiBaseUrl as string);
};
