/**
 * Composable para carregar dados detalhados de parceiros (fornecedores/prospectos)
 * no ModalDetalhesParceiro.
 *
 * Este composable determina automaticamente se deve usar os services de fornecedor
 * ou prospecto baseado na propriedade 'codfor' ou 'codpros' do parceiro.
 */

import type { ParceiroData } from "~/types/parceiro";

export const useParceiroDetalhesData = (
  parceiroFn: () => ParceiroData | null,
) => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const detalhesData = ref<{
    contatos?: unknown[];
    cargas?: unknown[];
    atendimentos?: unknown[];
    coletas?: unknown[];
    precos?: unknown[];
    checkins?: unknown[];
  }>({});

  const parceiro = computed(() => parceiroFn());

  const isFornecedor = computed(() => {
    return parceiro.value?.codfor && !parceiro.value?.codpros;
  });

  const isProspecto = computed(() => {
    return parceiro.value?.codpros || (parceiro.value?.tf?.startsWith("PRO"));
  });

  const codforOrCodpros = computed(() => {
    if (!parceiro.value) return null;
    return parceiro.value.codfor || parceiro.value.codpros || null;
  });

  /**
   * Carrega os dados detalhados do parceiro.
   * Determina automaticamente qual service usar baseado no tipo de parceiro.
   */
  const loadDetalhes = async () => {
    if (!codforOrCodpros.value) {
      error.value = "Código do parceiro não encontrado";
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      if (isFornecedor.value) {
        const { useFornecedorDetalhesService } = await import(
          "~/layers/fornecedores/composables/useFornecedorDetalhesService"
        );
        const service = useFornecedorDetalhesService();

        const data = await service.fetchAllDetalhes(codforOrCodpros.value);

        detalhesData.value = {
          contatos: data.contatos?.data.items || [],
          cargas: data.cargas?.data.items || [],
          atendimentos: data.atendimentos?.data.items || [],
          coletas: data.coletas?.data.items || [],
          precos: data.precos?.data.items || [],
          checkins: data.checkins?.data.items || [],
        };
      } else if (isProspecto.value) {
        const { useProspectoDetalhesService } = await import(
          "~/layers/prospectos/composables/useProspectoDetalhesService"
        );
        const service = useProspectoDetalhesService();

        const data = await service.fetchAllDetalhes(codforOrCodpros.value);

        detalhesData.value = {
          contatos: data.contatos?.data.items || [],
          cargas: data.cargas?.data.items || [],
          atendimentos: data.atendimentos?.data.items || [],
          coletas: data.coletas?.data.items || [],
          precos: data.precos?.data.items || [],
          checkins: data.checkins?.data.items || [],
        };
      } else {
        error.value = "Tipo de parceiro não reconhecido";
      }
    } catch (err) {
      console.error("Erro ao carregar detalhes do parceiro:", err);
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
  const enrichParceiroWithDetalhes = (
    parceiroData: ParceiroData | null,
  ): ParceiroData | null => {
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
