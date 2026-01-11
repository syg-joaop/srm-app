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
          <button
            class="md:hidden p-2 hover:bg-[var(--color-hover)] rounded-lg"
            @click="
              $emit('close');
              $emit('update:modelValue', false);
            "
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
          <UiButton variant="ghost" class="!px-2 !py-1 !text-[var(--color-primary)]">
            <MessageSquare class="w-5 h-5" />
            <span class="text-sm font-medium">Atender</span>
          </UiButton>

          <div class="h-6 w-px bg-[var(--color-border)]"></div>

          <div class="flex items-center gap-1">
            <button class="p-2 hover:bg-[var(--color-hover)] rounded-lg">
              <Presentation class="w-5 h-5" />
            </button>
            <button class="p-2 hover:bg-[var(--color-hover)] rounded-lg">
              <UserPlus class="w-5 h-5" />
            </button>
            <button class="p-2 hover:bg-[var(--color-hover)] rounded-lg">
              <Edit class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div
        class="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-16 px-6">
      <div
        class="w-16 h-16 rounded-full bg-[var(--color-danger-soft)] flex items-center justify-center mb-4"
      >
        <AlertCircle class="w-8 h-8 text-[var(--color-danger)]" />
      </div>
      <h3 class="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
      <p class="text-sm text-[var(--color-text-muted)] mb-4">{{ error }}</p>
      <UiButton variant="primary" @click="loadData">
        <RefreshCw class="w-4 h-4" />
        <span>Tentar novamente</span>
      </UiButton>
    </div>

    <!-- Content -->
    <div v-else class="mt-4 -mx-6">
      <!-- Tabs Navigation -->
      <div
        class="flex items-center gap-5 px-6 border-b border-[var(--color-border)] mb-6 overflow-x-auto no-scrollbar"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          ref="tabButtonRefs"
          class="pb-3 text-sm font-medium relative whitespace-nowrap"
          :class="
            activeTab === tab.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
          "
          @click="selectTab(tab.id, index)"
        >
          {{ tab.label }}
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]"
          ></div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="px-6 min-h-[280px]">
        <Transition name="fade" mode="out-in">
          <div :key="activeTab">
            <!-- Cadastro Tab -->
            <div v-if="activeTab === 'cadastro' && currentItems.length" class="space-y-3">
              <div v-for="item in currentItems" :key="item.id">
                <UiBadge v-if="item.status" :variant="getVariant(item.status) as any" class="mb-3">
                  {{ item.status }}
                </UiBadge>

                <!-- Render seções em grid -->
                <div
                  v-for="section in ['Identificação', 'Localização', 'Informações Adicionais']"
                  :key="section"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 mb-3"
                >
                  <h3 class="text-[11px] font-semibold uppercase text-[var(--color-primary)] mb-3">
                    {{ section }}
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div v-for="detail in item.details" :key="detail.label" class="min-w-0">
                      <p class="text-[10px] uppercase text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- List Tabs (contatos, atendimentos, etc.) -->
            <div v-else-if="isLoading && activeTab !== 'cadastro'">
              <!-- Loading Skeleton -->
              <UiSkeletonCard :count="itemsPerPage" />
            </div>

            <div v-else-if="currentItems.length">
              <!-- Items Count -->
              <div class="flex items-center justify-between mb-4">
                <p class="text-xs text-[var(--color-text-muted)]">
                  {{ currentItems.length }} itens
                </p>
              </div>

              <!-- Items List -->
              <div class="space-y-3">
                <UiExpandableCard
                  v-for="item in paginatedItems"
                  :key="item.id"
                  :id="`card-${activeTab}-${item.id}`"
                  :title="item.title"
                  :subtitle="item.subtitle"
                  :right-label="item.rightLabel"
                  :icon="getTabIcon(activeTab)"
                  :status="item.status"
                  :status-variant="(status: string) => getVariant(status)"
                  :details="item.details"
                  :details-layout="item.detailsLayout"
                  :initial-visible-details="2"
                  expandable
                />
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center pt-4 border-t">
                <UiPaginacao
                  :page="currentPage"
                  :total-pages="totalPages"
                  :total-items="currentItems.length"
                  @update:page="currentPage = $event"
                />
              </div>
            </div>

            <!-- Empty State -->
            <UiEmptyState
              v-else
              :icon="getTabIcon(activeTab)"
              :title="`${activeTab} indisponível`"
              description="Nenhum item encontrado"
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
import { computed, ref, watch } from "vue";

import { useBreakpoint } from "~/composables/useBreakpoint";

import { useParceiroDetalhesData } from "./composables/useParceiroDetalhesData";
import { useParceiroModalData } from "./composables/useParceiroModalData";
import { getVariant } from "~/components/ui/utils/status";
import { useParceiroTabs } from "./composables/useParceiroTabs";

import type { ParceiroData, ParceiroVariant, TabId } from "~/types/parceiro";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    parceiro?: ParceiroData | null;
    variant?: ParceiroVariant;
  }>(),
  { parceiro: null, variant: "parceiro" },
);

defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// State management usando composables
const { isDesktop } = useBreakpoint();
const { isLoading, error, loadData: loadModalData, reset: resetModalData } = useParceiroModalData();

// Composables específicos do parceiro
const { loadDetalhes, clearDetalhes, enrichParceiroWithDetalhes } = useParceiroDetalhesData(
  () => props.parceiro,
);

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Tabs logic
const enrichedParceiro = computed(() => enrichParceiroWithDetalhes(props.parceiro));

const { activeTab, tabButtonRefs, tabs, activeMeta, isInactive, selectTab } = useParceiroTabs(
  computed(() => ({
    modelValue: props.modelValue,
    parceiro: enrichedParceiro.value,
    variant: props.variant,
  })),
);

// Load data
const loadData = async () => {
  if (!props.parceiro) return;
  await loadModalData(() => loadDetalhes());
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      loadData();
    } else {
      clearDetalhes();
      currentPage.value = 1;
      resetModalData();
    }
  },
  { immediate: true },
);

// Pagination computed
const currentItems = computed(() => activeMeta.value.items);
const totalPages = computed(() =>
  activeTab.value === "cadastro" ? 1 : Math.ceil(currentItems.value.length / itemsPerPage.value),
);
const paginatedItems = computed(() => {
  if (activeTab.value === "cadastro") return currentItems.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return currentItems.value.slice(start, start + itemsPerPage.value);
});

const TAB_ICONS: Record<TabId, Component> = {
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

const getTabIcon = (tabId: TabId) => TAB_ICONS[tabId] || FileText;
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
