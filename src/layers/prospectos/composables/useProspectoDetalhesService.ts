/**
 * Service para buscar dados detalhados de prospectos via chameleon-mode
 *
 * Este é um wrapper layer-specific que usa o service compartilhado de parceiros.
 * Mantém a nomenclatura específica de prospectos (codpros) enquanto usa
 * a implementação compartilhada.
 *
 * NOTA: Prospectos e fornecedores compartilham a mesma tabela (cag_for)
 * e estrutura de API, por isso usam o mesmo service compartilhado.
 */

import { useParceiroDetalhesService } from "~/composables/useParceiroDetalhesService";

import type {
  ParceiroPrecoResponse as ProspectoPrecoResponse,
  ParceiroContatoResponse as ProspectoContatoResponse,
  ParceiroCargaResponse as ProspectoCargaResponse,
  ParceiroAtendimentoResponse as ProspectoAtendimentoResponse,
  ParceiroColetaResponse as ProspectoColetaResponse,
  ParceiroCheckinResponse as ProspectoCheckinResponse,
} from "~/types/parceiro-detalhes.types";

// Re-export types com nomes específicos para prospectos (backward compatibility)
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
 * Wrapper específico para prospectos que usa o service compartilhado.
 *
 * NOTA: Este composable mantém a assinatura original (codpros) para
 * backward compatibility, mas internamente usa o service genérico.
 */
export const useProspectoDetalhesService = () => {
  const parceiroService = useParceiroDetalhesService();

  /**
   * Busca preços de um prospecto específico.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchPrecos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoPrecoResponse> => {
    return parceiroService.fetchPrecos(codpros, page, size);
  };

  /**
   * Busca contatos de um prospecto específico.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchContatos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoContatoResponse> => {
    return parceiroService.fetchContatos(codpros, page, size);
  };

  /**
   * Busca cargas de um prospecto específico.
   *
   * NOTA: Prospectos normalmente não têm cargas, mas a rota existe
   * para quando um prospecto se torna fornecedor.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCargas = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoCargaResponse> => {
    return parceiroService.fetchCargas(codpros, page, size);
  };

  /**
   * Busca atendimentos/ocorrências de um prospecto específico.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchAtendimentos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoAtendimentoResponse> => {
    return parceiroService.fetchAtendimentos(codpros, page, size);
  };

  /**
   * Busca coletas de um prospecto específico.
   *
   * NOTA: Prospectos normalmente não têm coletas, mas a rota existe
   * para quando um prospecto se torna fornecedor.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchColetas = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoColetaResponse> => {
    return parceiroService.fetchColetas(codpros, page, size);
  };

  /**
   * Busca check-ins de um prospecto específico.
   *
   * @param codpros - Código do prospecto
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCheckins = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoCheckinResponse> => {
    return parceiroService.fetchCheckins(codpros, page, size);
  };

  /**
   * Busca TODOS os detalhes de um prospecto de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codpros - Código do prospecto
   * @returns Objeto com todos os dados detalhados
   */
  const fetchAllDetalhes = async (codpros: string) => {
    return parceiroService.fetchAllDetalhes(codpros);
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
