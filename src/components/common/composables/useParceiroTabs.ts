import {
  build,
  buildCadastro,
  buildCargaFallback,
  buildCargas,
  buildContato,
} from "~/components/common/composables/utils/parceiro/builders";
import { ALL_TABS, EMPTY_STATE_COPY } from "~/components/common/composables/utils/parceiro/config";
import {
  filterTabs,
  getCountLabel,
  getInitialTab,
  getTabLabel,
  isParceiroInactive,
} from "~/components/common/composables/utils/parceiro/utils";

import type { ParceiroData } from "~/layers/common/schemas/parceiro.schema";
import type {
  DetailPair,
  ParceiroTabOption,
  ParceiroVariant,
  TabId,
  TabItem,
} from "~/components/ui/ui.types";

/**
 * Composable para gerenciar tabs do modal de detalhes do parceiro.
 */
export function useParceiroTabs(
  propsRef: ComputedRef<{
    modelValue: boolean;
    parceiro?: ParceiroData | null;
    variant?: ParceiroVariant;
  }>,
) {
  const activeTab = ref<TabId>(getInitialTab(propsRef.value.variant ?? "parceiro"));
  const tabButtonRefs = ref<HTMLElement[]>([]);

  const tabs = computed(() => filterTabs(propsRef.value.variant ?? "parceiro"));

  const isInactive = computed(() => isParceiroInactive(propsRef.value.parceiro ?? null));

  const getItems = (tabId: TabId): TabItem[] => {
    const parceiro = propsRef.value.parceiro as Record<string, unknown> | null;
    if (!parceiro) {
      return [];
    }

    if (tabId === "cadastro") {
      const items = buildCadastro(parceiro);
      return items.length ? items : [];
    }

    if (tabId === "contatos") {
      const contatos = parceiro.contatos;
      if (Array.isArray(contatos)) {
        const items = build(contatos, tabId);
        return items.length ? items : [];
      }
      const items = buildContato(parceiro);
      return items.length ? items : [];
    }

    if (tabId === "cargas") {
      const cargas = parceiro.cargas;
      if (Array.isArray(cargas)) {
        const items = buildCargas(cargas);
        return items.length ? items : [];
      }
      const items = buildCargaFallback(parceiro);
      return items.length ? items : [];
    }

    const listData = parceiro[tabId];
    if (Array.isArray(listData)) {
      const items = build(listData, tabId);
      return items.length ? items : [];
    }

    return [];
  };

  const itemsMap = computed(() => {
    const result = {} as Record<TabId, TabItem[]>;
    ALL_TABS.forEach((tab: ParceiroTabOption) => {
      result[tab.id as TabId] = getItems(tab.id);
    });
    return result;
  });

  const activeMeta = computed(() => {
    const tabId = activeTab.value;
    const items = itemsMap.value[tabId] ?? [];
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

  const selectTab = (tabId: TabId, idx: number) => {
    activeTab.value = tabId;
    const tabEl = tabButtonRefs.value[idx];
    if (tabEl) {
      tabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  watch(
    () => propsRef.value.variant,
    (newVariant) => {
      activeTab.value = getInitialTab(newVariant ?? "parceiro");
    },
  );

  return {
    activeTab,
    tabButtonRefs,
    tabs,
    itemsMap,
    activeMeta,
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
    details.filter((d) =>
      (CADASTRO_FIELD_CATEGORIES.IDENTIFICATION as readonly string[]).includes(d.label),
    ),

  getLocation: (details: DetailPair[]) =>
    details.filter((d) =>
      (CADASTRO_FIELD_CATEGORIES.LOCATION as readonly string[]).includes(d.label),
    ),

  getAdditional: (details: DetailPair[]) =>
    details.filter((d) =>
      (CADASTRO_FIELD_CATEGORIES.ADDITIONAL as readonly string[]).includes(d.label),
    ),
};
