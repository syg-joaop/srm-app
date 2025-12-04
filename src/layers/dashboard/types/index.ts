/**
 * Tipos do Dashboard
 * Define estruturas de dados para indicadores, estatísticas e gráficos
 */

// ==================== DASHBOARD DATA STRUCTURES ====================

/**
 * Item de estatística exibido em cards
 */
export interface StatItem {
  label: string
  value: string | number
  icon: string
  color: string
}

/**
 * Item de compra do mês
 */
export interface CompraItem {
  label: string
  value: string
}

/**
 * Item de comprador com valores do mês atual e anterior
 */
export interface CompradorItem {
  name: string
  current: string
  previous: string
}

/**
 * Item de produto mais comprado
 */
export interface ProdutoItem {
  name: string
  current: string
  previous: string
}

/**
 * Item de aniversariante
 */
export interface AniversarianteItem {
  name: string
  location: string
  status: string
  date: string
}

/**
 * Item de atendente
 */
export interface AtendenteItem {
  role: string
  s1: number
  s2: number
  s3: number
  s4: number
}

/**
 * Dados de gráfico de pizza (ocorrências)
 */
export interface OcorrenciasPieItem {
  value: number
  name: string
  itemStyle?: {
    color: string
  }
}

/**
 * Dados de gráfico de linha (ocorrências ao longo do tempo)
 */
export interface OcorrenciasLineData {
  months: string[]
  values: number[]
}

/**
 * Dados de meta diária
 */
export interface MetaDiariaData {
  days: string[]
  values: number[]
}

/**
 * Dados de descontos
 */
export interface DescontosData {
  months: string[]
  values: number[]
}

/**
 * Dados consolidados de gráficos
 */
export interface ChartData {
  ocorrenciasPie: OcorrenciasPieItem[]
  ocorrenciasLine: OcorrenciasLineData
  metaDiaria: MetaDiariaData
  descontos: DescontosData
}

/**
 * Estrutura completa de dados do Dashboard
 */
export interface DashboardData {
  stats: StatItem[]
  comprasMes: CompraItem[]
  comprasMesAnterior: CompraItem[]
  compradorItems: CompradorItem[]
  produtosItems: ProdutoItem[]
  aniversariantesItems: AniversarianteItem[]
  atendentesItems: AtendenteItem[]
  chartData: ChartData
}

// ==================== API RESPONSE TYPES ====================

/**
 * Indicador vindo da API
 */
export interface ApiIndicador {
  tipo: string
  count: number | string
}

/**
 * Estrutura de resposta da API do dashboard
 */
export interface DashboardApiResponse {
  indicadoresDashboard?: {
    data: ApiIndicador[]
  }
  comprasMes?: {
    data: Array<Record<string, unknown>>
  }
  comprasComprador?: {
    data: Array<Record<string, unknown>>
  }
  prodsMaisCompradosMes?: {
    data: Array<Record<string, unknown>>
  }
  aniversariantesFornecedores?: {
    data: Array<Record<string, unknown>>
  }
  atendentes?: {
    data: Array<Record<string, unknown>>
  }
  ocorrencias12Meses?: {
    data: Array<Record<string, unknown>>
  }
  ocorrencias6Meses?: {
    data: Array<Record<string, unknown>>
  }
  metaDiaria?: {
    data: Array<Record<string, unknown>>
  }
  totalDescontos?: {
    data: Array<Record<string, unknown>>
  }
}

// ==================== DASHBOARD STATE ====================

/**
 * Estado do dashboard na store
 */
export interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  lastFetched: Date | null
}
