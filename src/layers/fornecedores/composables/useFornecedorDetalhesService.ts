/**
 * Service para buscar dados detalhados de fornecedores via chameleon-mode
 *
 * Este é um wrapper layer-specific que usa o service compartilhado de parceiros.
 * Mantém a nomenclatura específica de fornecedores (codfor) enquanto usa
 * a implementação compartilhada.
 */

import type {
  ParceiroPrecoResponse as FornecedorPrecoResponse,
  ParceiroContatoResponse as FornecedorContatoResponse,
  ParceiroCargaResponse as FornecedorCargaResponse,
  ParceiroAtendimentoResponse as FornecedorAtendimentoResponse,
  ParceiroColetaResponse as FornecedorColetaResponse,
  ParceiroCheckinResponse as FornecedorCheckinResponse,
} from "~/types/parceiro-detalhes.types";
import { useParceiroDetalhesService } from "~/composables/useParceiroDetalhesService";

// Re-export types com nomes específicos para fornecedores (backward compatibility)
export type {
  ParceiroPrecoResponse,
  ParceiroContatoResponse,
  ParceiroCargaResponse,
  ParceiroAtendimentoResponse,
  ParceiroColetaResponse,
  ParceiroCheckinResponse,
} from "~/types/parceiro-detalhes.types";

// ============================================================================
// SERVICE COMPOSABLE (WRAPPER)
// ============================================================================

/**
 * Wrapper específico para fornecedores que usa o service compartilhado.
 *
 * NOTA: Este composable mantém a assinatura original (codfor) para
 * backward compatibility, mas internamente usa o service genérico.
 */
export const useFornecedorDetalhesService = () => {
  const parceiroService = useParceiroDetalhesService();

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
    return parceiroService.fetchPrecos(codfor, page, size);
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
    return parceiroService.fetchContatos(codfor, page, size);
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
    return parceiroService.fetchCargas(codfor, page, size);
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
    return parceiroService.fetchAtendimentos(codfor, page, size);
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
    return parceiroService.fetchColetas(codfor, page, size);
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
