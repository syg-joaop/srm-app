/**
 * Tipos de Fornecedores (Suppliers)
 * Define estruturas de dados para gerenciamento de fornecedores
 */

// ==================== SUPPLIER DATA STRUCTURES ====================

/**
 * Fornecedor
 */
export interface Supplier {
  id: string | number
  nome: string
  cnpj?: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  status: 'ativo' | 'inativo' | 'prospecto'
  categoria?: string
  dataRegistro?: string
  ultimoContato?: string
  observacoes?: string
  [key: string]: unknown // Permite campos adicionais da API
}

/**
 * Dados resumidos de fornecedor para listagens
 */
export interface SupplierSummary {
  id: string | number
  nome: string
  cnpj?: string
  status: 'ativo' | 'inativo' | 'prospecto'
  cidade?: string
  ultimoContato?: string
}

// ==================== API RESPONSE TYPES ====================

/**
 * Resposta da API com lista de fornecedores
 */
export interface SupplierListResponse {
  data: Supplier[]
  page: number
  limit: number
  total: number
  totalPages?: number
}

/**
 * Resposta da API com detalhes de um fornecedor
 */
export interface SupplierDetailResponse {
  data: Supplier
}

/**
 * Parâmetros para filtrar fornecedores
 */
export interface SupplierFilters {
  search?: string
  status?: 'ativo' | 'inativo' | 'prospecto' | 'todos'
  categoria?: string
  cidade?: string
  estado?: string
  page?: number
  limit?: number
  sortBy?: 'nome' | 'dataRegistro' | 'ultimoContato'
  sortOrder?: 'asc' | 'desc'
}

// ==================== SUPPLIER STATE ====================

/**
 * Estado de fornecedores na store
 */
export interface SupplierState {
  suppliers: Supplier[]
  currentSupplier: Supplier | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}
