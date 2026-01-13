/**
 * Service compartilhado para buscar dados detalhados de parceiros via chameleon-mode
 *
 * Este service é utilizado por fornecedores e prospectos, que compartilham
 * a mesma tabela (cag_for) e estrutura de API.
 *
 */

import { z } from "zod";

import { checkinResponseSchema } from "~/layers/checkin/schemas/checkin.schema";
import {
  cargaResponseSchema,
  coletaResponseSchema,
  contatoResponseSchema,
  precoResponseSchema,
} from "~/layers/common/schemas";
import { atendimentoResponseSchema } from "~/layers/ocorrencias/schemas/atendimentos.schema";

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
 * Constrói o corpo da requisição para endpoints detalhados de parceiro.
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

export const useParceiroDetalhesService = () => {
  const api = useMainApi(true); // homol = true

  /**
   * Busca preços de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchPrecos = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof precoResponseSchema>>(ENDPOINTS.PRECO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca contatos de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchContatos = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof contatoResponseSchema>>(ENDPOINTS.CONTATO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca cargas de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCargas = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof cargaResponseSchema>>(ENDPOINTS.CARGA, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca atendimentos/ocorrências de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchAtendimentos = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof atendimentoResponseSchema>>(ENDPOINTS.ATENDIMENTO, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca coletas de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchColetas = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof coletaResponseSchema>>(ENDPOINTS.COLETA, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca check-ins de um parceiro específico.
   *
   * @param codfor - Código do parceiro (pode ser codfor ou codpros)
   * @param page - Página atual (default: 1)
   * @param size - Itens por página (default: 50)
   */
  const fetchCheckins = async (codfor: string, page: number = 1, size: number = 50) => {
    const body = buildDetalheBody(codfor, page, size);
    return api<z.infer<typeof checkinResponseSchema>>(ENDPOINTS.CHECKIN, {
      method: "POST",
      body,
    });
  };

  /**
   * Busca TODOS os detalhes de um parceiro de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codfor - Código do parceiro
   * @returns Objeto com todos os dados detalhados
   */
  const fetchAllDetalhes = async (codfor: string) => {
    const [precos, contatos, cargas, atendimentos, coletas, checkins] = await Promise.allSettled([
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
      atendimentos: atendimentos.status === "fulfilled" ? atendimentos.value : null,
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
