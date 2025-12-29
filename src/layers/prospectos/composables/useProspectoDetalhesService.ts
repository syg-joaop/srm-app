/**
 * Service para buscar dados detalhados de prospectos via chameleon-mode
 *
 * NOTA IMPORTANTE: As rotas chameleon-mode foram desenhadas para fornecedores
 * e usam o parâmetro "codfor". Prospectos e fornecedores compartilham a mesma
 * tabela (cag_for) e estrutura, então usamos o mesmo código (codfor/codpros).
 *
 * Este service é um adaptador que usa as rotas de fornecedor para prospectos.
 */

import type {
  ProspectoPrecoResponse,
  ProspectoContatoResponse,
  ProspectoCargaResponse,
  ProspectoAtendimentoResponse,
  ProspectoColetaResponse,
  ProspectoCheckinResponse,
} from "../types/prospectos.detalhes.types";

import {
  useFornecedorDetalhesService as useFornecedorService,
} from "~/layers/fornecedores/composables/useFornecedorDetalhesService";

// ============================================================================
// SERVICE COMPOSABLE
// ============================================================================

export const useProspectoDetalhesService = () => {
  const fornecedorService = useFornecedorService();

  /**
   * Busca preços de um prospecto específico.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchPrecos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoPrecoResponse> => {
    return fornecedorService.fetchPrecos(codpros, page, size);
  };

  /**
   * Busca contatos de um prospecto específico.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchContatos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoContatoResponse> => {
    return fornecedorService.fetchContatos(codpros, page, size);
  };

  /**
   * Busca cargas de um prospecto específico.
   *
   * NOTA: Prospectos normalmente não têm cargas, mas a rota existe
   * para quando um prospecto se torna fornecedor.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCargas = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoCargaResponse> => {
    return fornecedorService.fetchCargas(codpros, page, size);
  };

  /**
   * Busca atendimentos/ocorrências de um prospecto específico.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchAtendimentos = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoAtendimentoResponse> => {
    return fornecedorService.fetchAtendimentos(codpros, page, size);
  };

  /**
   * Busca coletas de um prospecto específico.
   *
   * NOTA: Prospectos normalmente não têm coletas, mas a rota existe
   * para quando um prospecto se torna fornecedor.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchColetas = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoColetaResponse> => {
    return fornecedorService.fetchColetas(codpros, page, size);
  };

  /**
   * Busca check-ins de um prospecto específico.
   *
   * @param codpros - Código do prospecto (mesmo que codfor)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCheckins = async (
    codpros: string,
    page: number = 1,
    size: number = 50,
  ): Promise<ProspectoCheckinResponse> => {
    return fornecedorService.fetchCheckins(codpros, page, size);
  };

  /**
   * Busca TODOS os detalhes de um prospecto de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codpros - Código do prospecto
   * @returns Objeto com todos os dados detalhados
   */
  const fetchAllDetalhes = async (codpros: string) => {
    const [precos, contatos, cargas, atendimentos, coletas, checkins] =
      await Promise.allSettled([
        fetchPrecos(codpros),
        fetchContatos(codpros),
        fetchCargas(codpros),
        fetchAtendimentos(codpros),
        fetchColetas(codpros),
        fetchCheckins(codpros),
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
