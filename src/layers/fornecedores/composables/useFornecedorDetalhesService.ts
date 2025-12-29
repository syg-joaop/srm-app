/**
 * Service para buscar dados detalhados de fornecedores via chameleon-mode
 *
 * Este service consome as rotas especializadas que retornam informações
 * específicas de um fornecedor como: preços, contatos, cargas, atendimentos, etc.
 */

import type {
  FornecedorPrecoResponse,
  FornecedorContatoResponse,
  FornecedorCargaResponse,
  FornecedorAtendimentoResponse,
  FornecedorColetaResponse,
  FornecedorCheckinResponse,
  FornecedorDetalheFilters,
} from "../types/fornecedores.detalhes.types";

// ============================================================================
// ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  PRECO: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_PRECO",
  CONTATO: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_CONTATO",
  CARGA: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_CARGA",
  ATENDIMENTO: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_ATENDIMENTO",
  COLETA: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_COLETA",
  CHECKIN: "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES_CHECKIN",
} as const;

// ============================================================================
// BODY BUILDERS
// ============================================================================

/**
 * Constrói o corpo da requisição para endpoints detalhados de fornecedor.
 * Todos esses endpoints exigem obrigatoriamente o parâmetro codfor.
 */
const buildDetalheBody = (
  codfor: string,
  page: number = 1,
  size: number = 50,
): Record<string, string | number> => ({
  codfor,
  page,
  size,
  offset: (page - 1) * size,
});

// ============================================================================
// SERVICE COMPOSABLE
// ============================================================================

export const useFornecedorDetalhesService = () => {
  const api = useMainApi(true); // homol = true

  /**
   * Busca preços de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchPrecos = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorPrecoResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorPrecoResponse>(ENDPOINTS.PRECO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca contatos de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchContatos = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorContatoResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorContatoResponse>(ENDPOINTS.CONTATO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca cargas de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCargas = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorCargaResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorCargaResponse>(ENDPOINTS.CARGA, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca atendimentos/ocorrências de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchAtendimentos = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorAtendimentoResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorAtendimentoResponse>(ENDPOINTS.ATENDIMENTO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca coletas de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchColetas = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorColetaResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorColetaResponse>(ENDPOINTS.COLETA, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca check-ins de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCheckins = async (
    codfor: string,
    page: number = 1,
    size: number = 50,
  ): Promise<FornecedorCheckinResponse> => {
    const body = buildDetalheBody(codfor, page, size);
    return api<FornecedorCheckinResponse>(ENDPOINTS.CHECKIN, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca TODOS os detalhes de um fornecedor de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codfor - Código do fornecedor
   * @returns Objeto com todos os dados detalhados
   */
  const fetchAllDetalhes = async (codfor: string) => {
    const [precos, contatos, cargas, atendimentos, coletas, checkins] =
      await Promise.allSettled([
        fetchPrecos(codfor),
        fetchContatos(codfor),
        fetchCargas(codfor),
        fetchAtendimentos(codfor),
        fetchColetas(codfor),
        fetchCheckins(codfor),
      ]);

    return {
      precos: precos.status === "fulfilled" ? precos.value : null,
      contatos: contatos.status === "fulfilled" ? contatos.value : null,
      cargas: cargas.status === "fulfilled" ? cargas.value : null,
      atendimentos:
        atendimentos.status === "fulfilled" ? atendimentos.value : null,
      coletas: coletas.status === "fulfilled" ? coletas.value : null,
      checkins: checkins.status === "fulfilled" ? checkins.value : null,
    };
  };

  return {
    fetchPrecos,
    fetchContatos,
    fetchCargas,
    fetchAtendimentos,
    fetchColetas,
    fetchCheckins,
    fetchAllDetalhes,
  };
};
