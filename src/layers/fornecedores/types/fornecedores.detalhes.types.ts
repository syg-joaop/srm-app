/**
 * Tipos para dados detalhados de fornecedores via chameleon-mode
 */

// ============================================================================
// PREÇOS
// ============================================================================

export interface FornecedorPreco {
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

export type FornecedorPrecoResponse = PaginatedResponse<FornecedorPreco>;

// ============================================================================
// CONTATOS
// ============================================================================

export interface FornecedorContato {
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

export type FornecedorContatoResponse = PaginatedResponse<FornecedorContato>;

// ============================================================================
// CARGAS
// ============================================================================

export interface FornecedorCarga {
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

export type FornecedorCargaResponse = PaginatedResponse<FornecedorCarga>;

// ============================================================================
// ATENDIMENTOS (OCORRÊNCIAS)
// ============================================================================

export interface FornecedorAtendimento {
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

export type FornecedorAtendimentoResponse = PaginatedResponse<FornecedorAtendimento>;

// ============================================================================
// COLETAS
// ============================================================================

export interface FornecedorColeta {
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

export type FornecedorColetaResponse = PaginatedResponse<FornecedorColeta>;

// ============================================================================
// CHECK-INS
// ============================================================================

export interface FornecedorCheckin {
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

export type FornecedorCheckinResponse = PaginatedResponse<FornecedorCheckin>;

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

export interface FornecedorDetalheFilters {
  codfor: string;
  page?: number;
  size?: number;
}
