/**
 * Tipos compartilhados para dados detalhados de parceiros (fornecedores/prospectos)
 *
 * Estes tipos são utilizados por múltiplas features que compartilham a mesma
 * estrutura de API e banco de dados (tabela cag_for).
 */

// ============================================================================
// PREÇOS
// ============================================================================

export interface ParceiroPreco {
  status: string;
  codpro: string;
  subcod: string;
  produto: string;
  tipo: string;
  preco: number;
  unidade: string;
  embalagem: string;
  tabela: string;
  validade: string;
  moeda: string;
}

export type ParceiroPrecoResponse = PaginatedResponse<ParceiroPreco>;

// ============================================================================
// CONTATOS
// ============================================================================

export interface ParceiroContato {
  sequencia: string;
  nome: string;
  cargo: string;
  departamento: string;
  telefone: string;
  celular: string;
  email: string;
  observacao: string;
  principal: boolean;
}

export type ParceiroContatoResponse = PaginatedResponse<ParceiroContato>;

// ============================================================================
// CARGAS
// ============================================================================

export interface ParceiroCarga {
  boleto: string;
  data_peso: string;
  hora_peso: string[];
  liquido_total: number;
  liquido_unitario: string[];
  valor_total: number;
  valor_unitario: string[];
  produto: string[];
  unidade: string[];
  quantidade: number;
}

export type ParceiroCargaResponse = PaginatedResponse<ParceiroCarga>;

// ============================================================================
// ATENDIMENTOS (OCORRÊNCIAS)
// ============================================================================

export interface ParceiroAtendimento {
  num: string;
  oco: string;
  data_oco: string;
  data_pro: string;
  status: string;
  situacao: string;
  atendente: string;
  atendente_enc: string;
  problema: string;
  prioridade: string;
}

export type ParceiroAtendimentoResponse = PaginatedResponse<ParceiroAtendimento>;

// ============================================================================
// COLETAS
// ============================================================================

export interface ParceiroColeta {
  ordem: string;
  datasai: string;
  datache: string;
  tot_cacamba: number;
  fornecedor: string;
  sr: string;
  local: string;
  bairro: string;
  cidade: string;
  uf: string;
  motorista: string;
  data: string;
  codfor: string;
  obs: string;
}

export type ParceiroColetaResponse = PaginatedResponse<ParceiroColeta>;

// ============================================================================
// CHECK-INS
// ============================================================================

export interface ParceiroCheckin {
  sr_recno: string;
  data: string;
  usuario: string;
  codfor: string;
  fornecedor: string;
  fanta: string;
  status: string;
  cidade: string;
  uf: string;
  latlong: boolean;
  lat_for: string;
  long_for: string;
  observacao: string;
}

export type ParceiroCheckinResponse = PaginatedResponse<ParceiroCheckin>;

// ============================================================================
// TIPO GENÉRICO DE RESPOSTA PAGINADA
// ============================================================================

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  success: boolean;
  data: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    items: T[];
  };
}

// ============================================================================
// FILTROS PARA AS ROTAS DETALHADAS
// ============================================================================

export interface ParceiroDetalheFilters {
  codfor: string;
  page?: number;
  size?: number;
}
