import type {
  AniversarianteItem,
  AtendenteItem,
  ModalVariant,
} from "../constants/painel.constants";
import type { Atendimento } from "../schemas/dashboard.schema";

type ParceiroSelecionado = AniversarianteItem | (AtendenteItem & { name: string }) | null;

/**
 * Composable para gerenciar modais do painel
 *
 * Centraliza a lógica de abertura de modais de parceiro e atendimento.
 */
export function usePainelModals() {
  // Estado dos modais
  const showParceiroModal = ref(false);
  const showAtendimentoModal = ref(false);

  // Dados selecionados
  const parceiroSelecionado = ref<ParceiroSelecionado>(null);
  const atendimentoSelecionado = ref<Atendimento | null>(null);
  const modalVariant = ref<ModalVariant>("parceiro");

  /**
   * Abre modal de atendimento
   */
  const openAtendimentoModal = (atendimento: Atendimento) => {
    atendimentoSelecionado.value = atendimento;
    showAtendimentoModal.value = true;
  };

  /**
   * Abre modal de parceiro (aniversariante)
   */
  const openParceiroModal = (parceiro: AniversarianteItem) => {
    modalVariant.value = "parceiro";
    parceiroSelecionado.value = parceiro;
    showParceiroModal.value = true;
  };

  /**
   * Abre modal de atendente
   */
  const openAtendenteModal = (atendente: AtendenteItem) => {
    modalVariant.value = "atendente";
    parceiroSelecionado.value = { ...atendente, name: atendente.role };
    showParceiroModal.value = true;
  };

  return {
    // Estado
    showParceiroModal,
    showAtendimentoModal,
    parceiroSelecionado,
    atendimentoSelecionado,
    modalVariant,
    // Handlers
    openAtendimentoModal,
    openParceiroModal,
    openAtendenteModal,
  };
}
