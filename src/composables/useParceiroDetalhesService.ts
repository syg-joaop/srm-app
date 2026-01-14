/**
 * Service compartilhado para buscar dados detalhados de fornecedores via chameleon-mode
 *
 * Este service é utilizado por fornecedores e prospectos, que compartilham
 * a mesma tabela (cag_for) e estrutura de API.
 *
 */

import { z } from "zod";

import { createDetailFetcher } from "./factories/createDetailFetcher";

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
// SERVICE COMPOSABLE
// ============================================================================

export const useParceiroDetalhesService = () => {
  const fetchPrecos = createDetailFetcher<z.infer<typeof precoResponseSchema>>(ENDPOINTS.PRECO);
  const fetchContatos = createDetailFetcher<z.infer<typeof contatoResponseSchema>>(ENDPOINTS.CONTATO);
  const fetchCargas = createDetailFetcher<z.infer<typeof cargaResponseSchema>>(ENDPOINTS.CARGA);
  const fetchAtendimentos = createDetailFetcher<z.infer<typeof atendimentoResponseSchema>>(ENDPOINTS.ATENDIMENTO);
  const fetchColetas = createDetailFetcher<z.infer<typeof coletaResponseSchema>>(ENDPOINTS.COLETA);
  const fetchCheckins = createDetailFetcher<z.infer<typeof checkinResponseSchema>>(ENDPOINTS.CHECKIN);

  /**
   * Busca TODOS os detalhes de um fornecedor de uma vez.
   * Útil para carregar todos os dados do modal em paralelo.
   *
   * @param codfor - Código do fornecedor
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
