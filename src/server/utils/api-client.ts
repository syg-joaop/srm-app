import type { H3Event } from 'h3'

export type ApiTarget = 'v1' | 'v2' | 'v2Homol'

const getApiBaseUrl = (config: Record<string, unknown>, target: ApiTarget) => {
  if (target === 'v1') return String(config.apiBaseUrl ?? '')
  if (target === 'v2Homol') return String(config.apiV2UrlHomol ?? '')
  return String(config.apiV2Url ?? '')
}

/**
 * Cria uma instância do $fetch configurada para fazer proxy para a API externa
 * Extrai o token de autenticação dos cookies e injeta nos headers
 */
export const createApiClient = (event: H3Event, target: ApiTarget = 'v2') => {
  const config = useRuntimeConfig(event)
  const token = getCookie(event, 'auth_token')

  const baseURL = getApiBaseUrl(config, target)
  const apiSecret = String(config.apiSecret ?? '')

  if (!baseURL) {
    throw createError({
      statusCode: 500,
      message: 'Configuração de API ausente (baseURL)'
    })
  }

  if (!apiSecret) {
    throw createError({
      statusCode: 500,
      message: 'Configuração de API ausente (API_SECRET)'
    })
  }

  return $fetch.create({
    baseURL,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-secret': apiSecret,
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
  options?: RequestInit & { query?: Record<string, any> },
  target: ApiTarget = 'v2'
): Promise<T> => {
  const apiClient = createApiClient(event, target)

  return await apiClient<T>(endpoint, options as any) as T
}
