/**
 * Composable para carregar dados detalhados de parceiros (fornecedores/prospectos)
 * no ModalDetalhesParceiro.
 *
 * Este composable determina automaticamente se deve usar os services de fornecedor
 * ou prospecto baseado na propriedade 'codfor' ou 'codpros' do parceiro.
 */

import { z } from "zod";

import { checkinSchema } from "~/layers/checkin/schemas/checkin.schema";
import { logger } from "~/utils/logger";

import type { Carga, Coleta, Contato, Preco } from "~/layers/common/schemas";
import type { ParceiroData } from "~/layers/common/schemas/parceiro.schema";
import type { Atendimento } from "~/layers/painel/schemas/dashboard.schema";

type Checkin = z.infer<typeof checkinSchema>;

export const useParceiroDetalhesData = (parceiroFn: () => ParceiroData | null) => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const detalhesData = ref<{
    contatos?: Contato[];
    cargas?: Carga[];
    atendimentos?: Atendimento[];
    coletas?: Coleta[];
    precos?: Preco[];
    checkins?: Checkin[];
  }>({} as Record<string, unknown[]>);

  const parceiro = computed(() => parceiroFn());

  // Verifica se é prospecto baseado no campo tf (começa com "PRO")
  const isProspecto = computed(() => {
    return typeof parceiro.value?.tf === "string" && parceiro.value.tf.startsWith("PRO");
  });

  // Fornecedor tem codfor E não é prospecto
  const isFornecedor = computed(() => {
    return parceiro.value?.codfor && !isProspecto.value;
  });

  // Usa codfor (agora usado tanto por fornecedores quanto prospectos da API)
  const codforOrCodpros = computed(() => {
    if (!parceiro.value) return null;
    const cod = parceiro.value.codfor || parceiro.value.codpros;
    return cod ? String(cod) : null;
  });

  /**
   * Carrega os dados detalhados do parceiro.
   */
  const loadDetalhes = async () => {
    if (!codforOrCodpros.value) {
      error.value = "Código do parceiro não encontrado";
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const { useParceiroDetalhesService } = await import(
        "~/composables/useParceiroDetalhesService"
      );
      const service = useParceiroDetalhesService();

      const data = await service.fetchAllDetalhes(codforOrCodpros.value);

      detalhesData.value = {
        contatos: (data.contatos?.data.items as Contato[]) || [],
        cargas: (data.cargas?.data.items as Carga[]) || [],
        atendimentos: (data.atendimentos?.data.items as Atendimento[]) || [],
        coletas: (data.coletas?.data.items as Coleta[]) || [],
        precos: (data.precos?.data.items as Preco[]) || [],
        checkins: (data.checkins?.data.items as Checkin[]) || [],
      };
    } catch (err) {
      logger.error("[useParceiroDetalhesData] Erro ao carregar detalhes do parceiro:", err);
      error.value = err instanceof Error ? err.message : "Erro ao carregar dados";
      detalhesData.value = {};
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Limpa os dados carregados.
   */
  const clearDetalhes = () => {
    detalhesData.value = {};
    error.value = null;
  };

  /**
   * Enriquece o objeto parceiro com os dados detalhados carregados.
   * Isso permite que o modal acesse os dados via parceiro.contatos, etc.
   */
  const enrichParceiroWithDetalhes = (parceiroData: ParceiroData | null): ParceiroData | null => {
    if (!parceiroData) return null;

    return {
      ...parceiroData,
      ...detalhesData.value,
    };
  };

  return {
    isLoading,
    error,
    detalhesData,
    isFornecedor,
    isProspecto,
    loadDetalhes,
    clearDetalhes,
    enrichParceiroWithDetalhes,
  };
};
