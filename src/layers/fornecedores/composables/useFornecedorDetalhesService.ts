import { useParceiroDetalhesService } from "~/composables/useParceiroDetalhesService";

// ============================================================================
// SERVICE COMPOSABLE (WRAPPER)
// ============================================================================

export const useFornecedorDetalhesService = () => {
  const parceiroService = useParceiroDetalhesService();

  /**
   * Busca preços de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchPrecos = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchPrecos(codfor, page, size);
  };

  /**
   * Busca contatos de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchContatos = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchContatos(codfor, page, size);
  };

  /**
   * Busca cargas de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCargas = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchCargas(codfor, page, size);
  };

  /**
   * Busca atendimentos/ocorrências de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchAtendimentos = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchAtendimentos(codfor, page, size);
  };

  /**
   * Busca coletas de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchColetas = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchColetas(codfor, page, size);
  };

  /**
   * Busca check-ins de um fornecedor específico.
   *
   * @param codfor - Código do fornecedor
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCheckins = async (codfor: string, page: number = 1, size: number = 50) => {
    return parceiroService.fetchCheckins(codfor, page, size);
  };

  /**
   * Busca TODOS os detalhes de um fornecedor de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codfor - Código do fornecedor
   * @returns Objeto com todos os dados detalhados
   */
  const fetchAllDetalhes = async (codfor: string) => {
    return parceiroService.fetchAllDetalhes(codfor);
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
