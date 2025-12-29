/**
 * Tipos para dados detalhados de prospectos via chameleon-mode
 * NOTA: Como prospectos e fornecedores compartilham a mesma estrutura na API,
 * reutilizamos os tipos de fornecedor, apenas alterando o nome da chave primária
 */

export {
  type FornecedorPreco as ProspectoPreco,
  type FornecedorPrecoResponse as ProspectoPrecoResponse,
  type FornecedorContato as ProspectoContato,
  type FornecedorContatoResponse as ProspectoContatoResponse,
  type FornecedorCarga as ProspectoCarga,
  type FornecedorCargaResponse as ProspectoCargaResponse,
  type FornecedorAtendimento as ProspectoAtendimento,
  type FornecedorAtendimentoResponse as ProspectoAtendimentoResponse,
  type FornecedorColeta as ProspectoColeta,
  type FornecedorColetaResponse as ProspectoColetaResponse,
  type FornecedorCheckin as ProspectoCheckin,
  type FornecedorCheckinResponse as ProspectoCheckinResponse,
  type PaginatedResponse,
} from "~/layers/fornecedores/types/fornecedores.detalhes.types";

// ============================================================================
// FILTROS PARA AS ROTAS DETALHADAS DE PROSPECTO
// ============================================================================

export interface ProspectoDetalheFilters {
  codpros: string;
  page?: number;
  size?: number;
}
