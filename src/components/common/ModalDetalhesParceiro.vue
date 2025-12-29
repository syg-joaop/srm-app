<template>
  <UiModal
    :model-value="modelValue"
    size="large"
    :show-close="isDesktop"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <template #title>
      <div class="flex pt-2 flex-col md:flex-row md:items-center gap-3 w-full overflow-hidden pb-1">
        <div class="flex items-center gap-3 w-full md:w-auto min-w-0 flex-1">
          <div
            class="h-6 w-1 md:h-8 rounded-full shrink-0"
            :class="isInactive ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-primary)]'"
          ></div>
          <h2
            class="text-lg md:text-2xl font-bold text-[var(--color-text)] truncate flex-1 min-w-0"
          >
            {{ parceiro?.name || "Detalhes do Parceiro" }}
          </h2>
          <!-- Botão de fechar customizado apenas para mobile -->
          <button
            class="md:hidden p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
            @click="
              $emit('update:modelValue', false);
              $emit('close');
            "
            aria-label="Fechar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div
          v-if="variant !== 'time'"
          class="flex items-center gap-2 w-full md:w-auto md:ml-auto md:mr-8 border-t md:border-t-0 border-[var(--color-border)] pt-3 md:pt-0"
        >
          <UiButton
            variant="ghost"
            class="!px-2 !py-1 !text-[var(--color-primary)] hover:bg-[var(--color-hover)] shrink-0"
          >
            <template #default>
              <div class="flex items-center gap-2">
                <MessageSquare class="w-5 h-5 shrink-0" />
                <span class="text-sm font-medium">Atender</span>
              </div>
            </template>
          </UiButton>

          <div class="h-6 w-px bg-[var(--color-border)] mx-1"></div>

          <div class="flex items-center gap-1">
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Presentation class="w-5 h-5" />
            </button>
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <UserPlus class="w-5 h-5" />
            </button>
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Edit class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="isLoadingDetalhes" class="flex items-center justify-center py-16">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-[var(--color-text-muted)]">Carregando detalhes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="detalhesError" class="flex flex-col items-center justify-center py-16 px-6">
      <div class="w-16 h-16 rounded-full bg-[var(--color-danger-soft)] flex items-center justify-center mb-4">
        <AlertCircle class="w-8 h-8 text-[var(--color-danger)]" />
      </div>
      <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">Erro ao carregar dados</h3>
      <p class="text-sm text-[var(--color-text-muted)] text-center mb-4">{{ detalhesError }}</p>
      <UiButton variant="primary" @click="loadDetalhes">
        <template #default>
          <div class="flex items-center gap-2">
            <RefreshCw class="w-4 h-4" />
            <span>Tentar novamente</span>
          </div>
        </template>
      </UiButton>
    </div>

    <div v-else class="mt-4 -mx-6">
      <div class="relative w-full">
        <div
          class="tabs-scroll-container flex items-center gap-5 px-6 border-b border-[var(--color-border)] mb-6 overflow-x-auto no-scrollbar scroll-smooth"
        >
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            :ref="
              (el) => {
                if (el) tabButtonRefs[index] = el as HTMLElement;
              }
            "
            class="pb-3 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap shrink-0"
            :class="[
              activeTab === tab.id
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ]"
            @click="selectTab(tab.id, index)"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"
            ></div>
          </button>
          <div class="w-6 shrink-0 h-1"></div>
        </div>
      </div>

      <div ref="modalContentRef" class="px-6 min-h-[280px] md:min-h-[400px] modal-content-scroll overflow-y-auto">
        <Transition name="fade" mode="out-in">
          <div :key="activeTab" class="space-y-4">
            <!-- Tab de cadastro com layout em seções -->
            <div v-if="activeTab === 'cadastro' && activeTabMeta.items.length" class="space-y-3">
              <div v-for="item in activeTabMeta.items" :key="item.id">
                <!-- Badge de status do fornecedor -->
                <div v-if="item.status" class="mb-3">
                  <UiBadge
                    :variant="getStatusBadgeVariant(item.status)"
                    size="small"
                  >
                    {{ item.status }}
                  </UiBadge>
                </div>

                <!-- Seção 1: Identificação -->
                <div
                  v-if="filterCadastroFields.getIdentification(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 mb-3 shadow-sm"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Identificação
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getIdentification(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Seção 2: Localização -->
                <div
                  v-if="filterCadastroFields.getLocation(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 mb-3 shadow-sm"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Localização
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getLocation(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Seção 3: Informações Adicionais -->
                <div
                  v-if="filterCadastroFields.getAdditional(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-sm"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Informações Adicionais
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getAdditional(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabs de listagem com paginação (exceto cadastro) -->
            <div ref="listContainerRef" v-else-if="paginatedItems.length" class="space-y-4">
              <!-- Contador de resultados -->
              <div class="flex items-center justify-between px-1">
                <p class="text-xs text-[var(--color-text-muted)]">
                  {{ activeTabMeta.countLabel }}
                </p>
                <!-- Seletor de itens por página -->
                <div
                  v-if="activeTabMeta.items.length > ITEMS_PER_PAGE_OPTIONS[0]"
                  class="flex items-center gap-2"
                >
                  <label class="text-xs text-[var(--color-text-muted)]">Itens por página:</label>
                  <select
                    v-model="itemsPerPage"
                    class="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option v-for="option in ITEMS_PER_PAGE_OPTIONS" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Lista de itens com estilo premium -->
              <div class="space-y-2">
                <div
                  v-for="item in paginatedItems"
                  :key="item.id"
                  class="group/item relative rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 transition-all duration-300 ease-out hover:border-[var(--color-primary-border)] hover:shadow-md hover:bg-[var(--color-primary-soft)]"
                >
                  <!-- Indicador visual lateral -->
                  <div
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[var(--color-primary)] rounded-r-full opacity-0 group-hover/item:h-8 group-hover/item:opacity-100 transition-all duration-300"
                  ></div>

                  <!-- Linha 1: Ícone + Título + Status -->
                  <div class="flex items-start gap-3 min-w-0">
                    <!-- Ícone específico por tipo de tab -->
                    <div
                      class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      :class="getTabIconContainerClass(activeTab)"
                    >
                      <component
                        :is="getTabIcon(activeTab)"
                        class="w-4 h-4"
                        :class="getTabIconClass(activeTab)"
                      />
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                          <p
                            class="text-sm font-semibold text-[var(--color-text)] truncate"
                            :title="item.title"
                          >
                            {{ item.title }}
                          </p>
                          <p
                            v-if="item.subtitle"
                            class="text-xs text-[var(--color-text-muted)] mt-0.5 truncate"
                            :title="item.subtitle"
                          >
                            {{ item.subtitle }}
                          </p>
                        </div>

                        <UiBadge
                          v-if="item.status"
                          :variant="getStatusBadgeVariant(item.status)"
                          size="small"
                          class="shrink-0"
                        >
                          {{ item.status }}
                        </UiBadge>
                      </div>

                      <!-- Linha 2: Detalhes em grid -->
                      <div
                        v-if="item.details.length"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3"
                      >
                        <div
                          v-for="detail in item.details.slice(0, 6)"
                          :key="detail.label"
                          class="flex items-start gap-2 min-w-0"
                        >
                          <span
                            class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] shrink-0 mt-0.5"
                          >
                            {{ detail.label }}:
                          </span>
                          <span
                            class="text-xs font-medium truncate"
                            :class="
                              detail.value === '-'
                                ? 'text-[var(--color-text-muted)]'
                                : 'text-[var(--color-text)]'
                            "
                            :title="detail.value"
                          >
                            {{ detail.value }}
                          </span>
                        </div>
                        <div
                          v-if="item.details.length > 6"
                          class="text-[10px] text-[var(--color-primary)] font-medium"
                        >
                          +{{ item.details.length - 6 }} informações
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Paginação -->
              <div
                v-if="totalPages > 1"
                class="flex justify-center pt-4 border-t border-[var(--color-border)]"
              >
                <UiPaginacao
                  :page="currentPage"
                  :total-pages="totalPages"
                  :total-items="activeTabMeta.items.length"
                  @update:page="goToPage"
                />
              </div>
            </div>

            <!-- Empty State com ícone específico -->
            <UiEmptyState
              v-else
              :icon="getEmptyStateIcon(activeTab)"
              :title="activeTabMeta.emptyTitle"
              :description="activeTabMeta.emptyDescription"
            />
          </div>
        </Transition>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Contact,
  Edit,
  FileText,
  MessageSquare,
  Package,
  Presentation,
  RefreshCw,
  Tag,
  Truck,
  UserCheck,
  UserPlus,
} from "lucide-vue-next";
import type { Variant } from "~/components/ui/UiBadge.vue";
import UiBadge from "~/components/ui/UiBadge.vue";
import UiButton from "~/components/ui/UiButton.vue";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiModal from "~/components/ui/UiModal.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
import type { ParceiroData, ParceiroVariant, TabId } from "~/types/parceiro";
import { getStatusClass as getStatusClassUtil } from "~/utils/helpers/parceiro";
import { useParceiroTabs, filterCadastroFields } from "./composables/useParceiroTabs";
import { useParceiroDetalhesData } from "./composables/useParceiroDetalhesData";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    parceiro?: ParceiroData | null;
    variant?: ParceiroVariant;
  }>(),
  {
    parceiro: null,
    variant: "parceiro",
  },
);

defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// Ref para o elemento de scroll do modal
const modalContentRef = ref<HTMLElement | null>(null);
// Ref para o container da lista de itens
const listContainerRef = ref<HTMLElement | null>(null);

// Constantes de paginação
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;
const DEFAULT_ITEMS_PER_PAGE = 10;

// Composable para carregar dados detalhados do parceiro
const parceiroRef = computed(() => props.parceiro);

const {
  isLoading: isLoadingDetalhes,
  error: detalhesError,
  detalhesData,
  loadDetalhes,
  clearDetalhes,
  enrichParceiroWithDetalhes,
} = useParceiroDetalhesData(() => props.parceiro);

// Computed que enriquece o parceiro com os detalhes carregados
const enrichedParceiro = computed(() =>
  enrichParceiroWithDetalhes(props.parceiro)
);

// Watch para carregar dados quando o modal abre ou o parceiro muda
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.parceiro) {
      await loadDetalhes();
    } else {
      clearDetalhes();
    }
  },
  { immediate: true }
);

// Composable de tabs - usa o parceiro enriquecido
const {
  activeTab,
  tabButtonRefs,
  tabs,
  activeTabMeta,
  isInactive,
  selectTab,
} = useParceiroTabs(
  computed(() => ({
    modelValue: props.modelValue,
    parceiro: enrichedParceiro.value,
    variant: props.variant,
  }))
);

// Paginação
const currentPage = ref(1);
const itemsPerPage = ref(DEFAULT_ITEMS_PER_PAGE);

// Resetar paginação quando mudar de tab
watch(activeTab, () => {
  currentPage.value = 1;
});

// Calcular itens paginados
const totalPages = computed(() => {
  const items = activeTabMeta.value.items;
  if (!items.length || activeTab.value === 'cadastro') return 1;
  return Math.ceil(items.length / itemsPerPage.value);
});

const paginatedItems = computed(() => {
  const items = activeTabMeta.value.items;
  if (activeTab.value === 'cadastro') return items;

  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;

  return items.slice(startIndex, endIndex);
});

const goToPage = (page: number) => {
  currentPage.value = page;

  // Scroll para o topo da listagem
  nextTick(() => {
    if (listContainerRef.value) {
      listContainerRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
};

// Funções auxiliares para UI
const getStatusBadgeVariant = (status: string): Variant => {
  const normalized = status.toLowerCase();

  if (normalized.includes("ativo") || normalized.includes("concluido") || normalized.includes("final")) {
    return "success";
  }
  if (normalized.includes("pendente") || normalized.includes("vencido") || normalized.includes("agendado")) {
    return "warning";
  }
  if (normalized.includes("inativo") || normalized.includes("cancel")) {
    return "danger";
  }
  if (normalized.includes("confirmado") || normalized.includes("em andamento")) {
    return "info";
  }

  return "default";
};

const getStatusClass = (status: string): string => {
  return getStatusClassUtil(status);
};

const getTabIcon = (tabId: TabId) => {
  const icons: Record<TabId, any> = {
    cadastro: FileText,
    contatos: Contact,
    cargas: Package,
    agendamentos: Calendar,
    atendimentos: MessageSquare,
    coletas: Truck,
    precos: Tag,
    checkins: UserCheck,
    favorecidos: UserPlus,
  };
  return icons[tabId] || FileText;
};

const getTabIconClass = (tabId: TabId) => {
  const classes: Record<TabId, string> = {
    cadastro: "text-blue-500",
    contatos: "text-blue-500",
    cargas: "text-blue-500",
    agendamentos: "text-blue-500",
    atendimentos: "text-blue-500",
    coletas: "text-blue-500",
    precos: "text-blue-500",
    checkins: "text-blue-500",
    favorecidos: "text-blue-500",
  };
  return classes[tabId] || "text-blue-500";
};

const getTabIconContainerClass = (tabId: TabId) => {
  const classes: Record<TabId, string> = {
    cadastro: "bg-blue-500/10",
    contatos: "bg-blue-500/10",
    cargas: "bg-blue-500/10",
    agendamentos: "bg-blue-500/10",
    atendimentos: "bg-blue-500/10",
    coletas: "bg-blue-500/10",
    precos: "bg-blue-500/10",
    checkins: "bg-blue-500/10",
    favorecidos: "bg-blue-500/10",
  };
  return classes[tabId] || "bg-blue-500/10";
};

const getEmptyStateIcon = (tabId: TabId) => {
  return getTabIcon(tabId);
};

// Responsividade
const isDesktop = ref(false);

const checkIfDesktop = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  checkIfDesktop();
  window.addEventListener("resize", checkIfDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfDesktop);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tabs-scroll-container {
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
</style>
