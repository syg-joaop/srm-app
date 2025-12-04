import type { H3Event } from 'h3'

/**
 * Cria uma instância do $fetch configurada para fazer proxy para a API externa
 * Extrai o token de autenticação dos cookies e injeta nos headers
 */
export const createApiClient = (event: H3Event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  return $fetch.create({
    baseURL: String(config.public.apiBaseUrl),
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'x-secret': config.xSecret,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    onRequest({ options }) {
      // Log de requests em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('[API Request]', options.method, options.baseURL)
      }
    },
    onResponse({ response }) {
      // Log de responses em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('[API Response]', response.status, response._data)
      }
    },
    onResponseError({ response }) {
      console.error('[API Error]', response.status, response._data)

      // Lançar erro apropriado baseado no status
      if (response.status === 401) {
        throw createError({
          statusCode: 401,
          message: 'Não autenticado. Faça login novamente.'
        })
      }

      if (response.status === 403) {
        throw createError({
          statusCode: 403,
          message: 'Acesso negado.'
        })
      }

      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          message: 'Recurso não encontrado.'
        })
      }

      if (response.status >= 500) {
        throw createError({
          statusCode: 500,
          message: 'Erro interno do servidor.'
        })
      }
    }
  })
}

/**
 * Helper para fazer requisições autenticadas à API externa
 * Uso: const data = await useApiRequest(event, '/endpoint', { method: 'POST', body: {...} })
 */
export const useApiRequest = async <T = any>(
  event: H3Event,
  endpoint: string,
  options?: RequestInit & { query?: Record<string, any> }
): Promise<T> => {
  const apiClient = createApiClient(event)

  return await apiClient<T>(endpoint, options as any) as T
}
