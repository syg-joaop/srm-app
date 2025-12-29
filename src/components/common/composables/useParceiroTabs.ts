import type { DetailPair, ParceiroData, ParceiroVariant, TabId, TabItem } from "~/types/parceiro";
import { MOCK_TAB_DATA } from "~/mocks/parceiro.mock";
import {
  ALL_TABS,
  EMPTY_STATE_COPY,
  buildCadastroItems,
  buildCargaFallbackItems,
  buildContatoItems,
  buildGenericItems,
  filterTabsByVariant,
  getCountLabel,
  getInitialTab,
  getTabLabel,
  isParceiroInactive,
} from "~/utils/helpers/parceiro";

/**
 * Composable para gerenciar tabs do modal de detalhes do parceiro.
 */
export function useParceiroTabs(
  props: { modelValue: boolean; parceiro?: ParceiroData | null; variant?: ParceiroVariant },
) {
  const activeTab = ref<TabId>(getInitialTab(props.variant));
  const tabButtonRefs = ref<HTMLElement[]>([]);

  const tabs = computed(() => filterTabsByVariant(props.variant));

  const isInactive = computed(() => isParceiroInactive(props.parceiro));

  /**
   * Constrói os itens de uma tab baseado no parceiro e tabId.
   */
  const getTabItems = (tabId: TabId): TabItem[] => {
    const parceiro = props.parceiro as Record<string, unknown> | null;
    if (!parceiro) {
      return [];
    }

    if (tabId === "cadastro") {
      const items = buildCadastroItems(parceiro);
      return items.length ? items : [];
    }

    if (tabId === "contatos") {
      const contatos = parceiro.contatos;
      if (Array.isArray(contatos)) {
        const items = buildGenericItems(contatos, tabId);
        return items.length ? items : [];
      }
      const items = buildContatoItems(parceiro);
      return items.length ? items : [];
    }

    if (tabId === "cargas") {
      const cargas = parceiro.cargas;
      if (Array.isArray(cargas)) {
        const items = buildGenericItems(cargas, tabId);
        return items.length ? items : [];
      }
      const items = buildCargaFallbackItems(parceiro);
      return items.length ? items : [];
    }

    const listData = parceiro[tabId];
    if (Array.isArray(listData)) {
      const items = buildGenericItems(listData, tabId);
      return items.length ? items : [];
    }

    return [];
  };

  const tabItemsMap = computed(() => {
    const result = {} as Record<TabId, TabItem[]>;
    ALL_TABS.forEach((tab) => {
      result[tab.id] = getTabItems(tab.id);
    });
    return result;
  });

  const activeTabMeta = computed(() => {
    const tabId = activeTab.value;
    const items = tabItemsMap.value[tabId] ?? [];
    const emptyCopy = EMPTY_STATE_COPY[tabId];
    return {
      id: tabId,
      label: getTabLabel(tabId),
      countLabel: getCountLabel(items.length),
      items,
      emptyTitle: emptyCopy.title,
      emptyDescription: emptyCopy.description,
    };
  });

  /**
   * Seleciona uma tab e faz scroll para o botão.
   */
  const selectTab = (tabId: TabId, index: number) => {
    activeTab.value = tabId;
    const tabEl = tabButtonRefs.value[index];
    if (tabEl) {
      tabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  // Atualiza tab ativa quando variant muda
  watch(
    () => props.variant,
    (newVariant) => {
      activeTab.value = getInitialTab(newVariant);
    },
  );

  return {
    activeTab,
    tabButtonRefs,
    tabs,
    tabItemsMap,
    activeTabMeta,
    isInactive,
    selectTab,
  };
}

/**
 * Constantes para categorização de campos de cadastro.
 */
export const CADASTRO_FIELD_CATEGORIES = {
  IDENTIFICATION: ["Codigo", "Categoria", "Cadastro", "Status"],
  LOCATION: ["Cidade", "UF", "Endereco"],
  ADDITIONAL: ["Ultima carga", "Telefone", "Celular", "Email"],
} as const;

/**
 * Filtra campos de cadastro por seção.
 */
export const filterCadastroFields = {
  getIdentification: (details: DetailPair[]) =>
    details.filter((d) => CADASTRO_FIELD_CATEGORIES.IDENTIFICATION.includes(d.label)),

  getLocation: (details: DetailPair[]) =>
    details.filter((d) => CADASTRO_FIELD_CATEGORIES.LOCATION.includes(d.label)),

  getAdditional: (details: DetailPair[]) =>
    details.filter((d) => CADASTRO_FIELD_CATEGORIES.ADDITIONAL.includes(d.label)),
};
