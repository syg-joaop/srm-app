/**
 * Tipos Genéricos de API
 * Define estruturas comuns para comunicação com APIs
 */

// ==================== GENERIC API RESPONSES ====================

/**
 * Resposta genérica de API com dados tipados
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

/**
 * Resposta de erro da API
 */
export interface ApiErrorResponse {
  statusCode: number
  statusMessage?: string
  message: string
  data?: unknown
}

/**
 * Resposta paginada de API
 */
export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages?: number
}

// ==================== API REQUEST OPTIONS ====================

/**
 * Parâmetros comuns para listagem de recursos
 */
export interface ApiListParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown // Permite filtros personalizados
}

/**
 * Métodos HTTP suportados
 */
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Opções para requisições de API
 */
export interface ApiRequestOptions {
  method?: ApiMethod
  body?: unknown
  query?: Record<string, unknown>
  headers?: Record<string, string>
}

// ==================== API CLIENT ====================

/**
 * Interface para cliente de API
 */
export interface ApiClient {
  get<T>(url: string, options?: ApiRequestOptions): Promise<T>
  post<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  put<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  patch<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T>
  delete<T>(url: string, options?: ApiRequestOptions): Promise<T>
}
