<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header  -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Ocorrencias
          </h1>
        </div>
      </div>

      <!-- Toolbar  -->
      <div class="sticky top-2 z-10">
        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Ação primária -->
            <button
              class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
              aria-label="Criar nova ocorrência"
            >
              <Plus class="w-4 h-4" />
              <span>Nova Ocorrência</span>
            </button>

            <div class="hidden sm:block w-px h-6 bg-[var(--color-border)]"></div>

            <!-- Search -->
            <div class="relative flex-1 min-w-0">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Pesquisar ocorrência..."
                class="w-full h-10 pl-10 pr-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <!-- Filtros -->
            <div class="flex items-center gap-2">
              <!-- Status -->
              <div class="w-full sm:w-auto sm:min-w-[160px]">
                <UiSelect
                  v-model="filters.status"
                  :options="statusOptions"
                  placeholder="Status"
                  class="w-full"
                />
              </div>

              <!-- Botão Filtros -->
              <button
                class="inline-flex items-center justify-center w-10 h-10 rounded-md border transition-all duration-150 relative"
                :class="
                  showFilters
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)]'
                "
                @click="showFilters = !showFilters"
                aria-label="Mostrar filtros"
              >
                <Filter class="w-4 h-4" />
                <span
                  v-if="activeFiltersCount > 0"
                  class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full bg-[var(--color-danger)] text-white"
                >
                  {{ activeFiltersCount }}
                </span>
              </button>

              <!-- Limpar filtros -->
              <Transition
                enter-active-class="transition-all duration-150"
                enter-from-class="opacity-0 scale-90"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-90"
              >
                <button
                  v-if="hasActiveFilters"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-hover)] hover:border-[var(--color-danger)] active:scale-95 transition-all duration-150 group"
                  @click="clearFilters"
                  aria-label="Limpar filtros"
                  title="Limpar filtros"
                >
                  <X
                    class="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-danger)] transition-colors"
                  />
                </button>
              </Transition>
            </div>
          </div>

          <!-- Painel de filtros expandido -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-48"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 max-h-48"
            leave-to-class="opacity-0 -translate-y-2 max-h-0"
          >
            <div v-if="showFilters" class="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <UiSelect
                  v-model="filters.atendente"
                  :options="atendenteOptions"
                  label="Atendente"
                  placeholder="Todos"
                />
                <UiSelect
                  v-model="filters.situacao"
                  :options="situacaoOptions"
                  label="Situação"
                  placeholder="Todos"
                />
                <UiSelect
                  v-model="filters.formaAtendimento"
                  :options="formaAtendimentoOptions"
                  label="Forma de Atendimento"
                  placeholder="Todos"
                />
                <UiSelect
                  v-model="filters.ordenarPor"
                  :options="ordenarPorOptions"
                  label="Ordenar por"
                  placeholder="Data de cadastro"
                />
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contador -->
      <div class="mt-4">
        <p class="text-sm text-[var(--color-text-muted)] font-mono tabular-nums">
          {{ fallbackTotalItems }} {{ fallbackTotalItems === 1 ? "ocorrência" : "ocorrências" }}
        </p>
      </div>
    </header>

    <!-- Badges de filtros ativos -->
    <UiFilterBadges
      :filters="filterBadges"
      @remove="handleRemoveFilter"
      @clear-all="clearFilters"
    />

    <!-- Loading state -->
    <UiListSkeleton
      v-if="isLoading"
      :count="5"
      :show-progress="false"
      :columns="{ title: 1, status: 3, actions: 1 }"
      :extra-columns="[
        { span: 2, width: '70%' },
        { span: 2, width: '50%' },
        { span: 3, width: '90%' },
      ]"
    />

    <!-- Content -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="!isLoading">
        <div v-if="paginatedOcorrencias.length > 0">
          <!-- Header da tabela -->
          <div
            class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
          >
            <div class="col-span-1">Status</div>
            <div class="col-span-3">Fornecedor</div>
            <div class="col-span-2">Data Cadastro</div>
            <div class="col-span-2">Atendente</div>
            <div class="col-span-3">Título</div>
            <div class="col-span-1 text-center">Ações</div>
          </div>

          <div class="flex flex-col gap-2 md:gap-0" role="list">
            <TransitionGroup name="list" tag="div" class="contents">
              <OcorrenciaCardItem
                v-for="item in paginatedOcorrencias"
                :key="item.id"
                :ocorrencia="item"
                @click="abrirDetalhes"
              />
            </TransitionGroup>
          </div>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <UiPaginacao
              :page="currentPage"
              :total-pages="totalPages"
              class="mt-6"
              aria-label="Paginação de ocorrências"
              @update:page="(p) => (currentPage = p)"
            />
          </Transition>
        </div>

        <!-- Empty state -->
        <div v-else class="py-20 text-center">
          <div class="max-w-md mx-auto">
            <div
              class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <MessageSquare class="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
              {{
                hasActiveFilters ? "Nenhuma ocorrência encontrada" : "Nenhuma ocorrência cadastrada"
              }}
            </h3>
            <p class="text-sm text-[var(--color-text-muted)] mb-6">
              {{
                hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a seleção."
                  : "As ocorrências aparecerão aqui quando cadastradas."
              }}
            </p>
            <button
              class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
              @click="hasActiveFilters ? clearFilters() : null"
            >
              <component :is="hasActiveFilters ? X : Plus" class="w-4 h-4" />
              <span>{{ hasActiveFilters ? "Limpar Filtros" : "Nova Ocorrência" }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal -->
    <ModalDetalhesOcorrencia
      v-model="showModal"
      :ocorrencia="ocorrenciaSelecionada"
      @update:status="handleStatusChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Filter, MessageSquare, Plus, Search, X } from "lucide-vue-next";
import { z } from "zod";

import ModalDetalhesOcorrencia from "../components/ModalDetalhesOcorrencia.vue";
import OcorrenciaCardItem from "../components/OcorrenciaCardItem.vue";
import { useOcorrenciasFilters } from "../composables/useOcorrenciasFilters";
import {
  ATENDENTE_OPTIONS,
  FORMA_ATENDIMENTO_OPTIONS,
  ORDENAR_POR_OPTIONS,
  PAGINACAO_PADRAO,
  SITUACAO_OPTIONS,
  STATUS_OPTIONS,
} from "../constants/ocorrencia.constants";
import { ocorrenciaSchema } from "../schemas/ocorrencias.schema";
import { normalizeOcorrencias } from "../utils/normalizers";

type Ocorrencia = z.infer<typeof ocorrenciaSchema>;
type OcorrenciaStatus = z.infer<typeof ocorrenciaSchema>["status"];

definePageMeta({ layout: "default" });

// =============================================================================
// CONSTANTES E OPÇÕES
// =============================================================================

const atendenteOptions = [...ATENDENTE_OPTIONS];
const situacaoOptions = [...SITUACAO_OPTIONS];
const formaAtendimentoOptions = [...FORMA_ATENDIMENTO_OPTIONS];
const statusOptions = [...STATUS_OPTIONS];
const ordenarPorOptions = [...ORDENAR_POR_OPTIONS];

// =============================================================================
// ESTADO E COMPOSABLES
// =============================================================================

const currentPage = ref<number>(PAGINACAO_PADRAO.page);
const itemsPerPage = ref<number>(PAGINACAO_PADRAO.itemsPerPage);

const {
  search: searchQuery,
  filters,
  showFilters,
  totalFiltrosAtivos: activeFiltersCount,
  hasActiveFilters,
  filterBadges,
  apiFilters,
  removeFilter: handleRemoveFilter,
  clearAllFilters,
} = useOcorrenciasFilters();

// =============================================================================
// DATA FETCHING
// =============================================================================

const { fetchOcorrencias } = useOcorrenciaService();

const { data: ocorrenciasResponse, status } = await useAsyncData(
  "ocorrencias",
  () => fetchOcorrencias(currentPage.value, itemsPerPage.value, apiFilters.value),
  { watch: [currentPage, itemsPerPage, apiFilters] },
);

const isLoading = computed(() => status.value === "pending");

const ocorrencias = computed(() => {
  const rawItems = ocorrenciasResponse.value?.data?.items ?? [];
  return normalizeOcorrencias(rawItems);
});

const fallbackTotalItems = computed(
  () => ocorrenciasResponse.value?.data?.totalItems ?? ocorrencias.value.length,
);

const totalPages = computed(() => {
  const apiTotalPages = ocorrenciasResponse.value?.data?.totalPages;
  if (apiTotalPages) return apiTotalPages;
  return Math.max(1, Math.ceil((fallbackTotalItems.value || 0) / itemsPerPage.value));
});

const paginatedOcorrencias = computed(() => {
  const items = ocorrencias.value;
  if (ocorrenciasResponse.value?.data?.totalPages) return items;

  const start = (currentPage.value - 1) * itemsPerPage.value;
  return items.slice(start, start + itemsPerPage.value);
});

// =============================================================================
// WATCHERS
// =============================================================================

watch([searchQuery, filters], () => (currentPage.value = 1), { deep: true });
watch(currentPage, () => window.scrollTo({ top: 0, behavior: "smooth" }));

// =============================================================================
// HANDLERS
// =============================================================================

const clearFilters = () => {
  clearAllFilters();
  currentPage.value = 1;
};

// Modal de detalhes
const showModal = ref(false);
const ocorrenciaSelecionada = ref<Ocorrencia | null>(null);

const abrirDetalhes = (ocorrencia: Ocorrencia) => {
  ocorrenciaSelecionada.value = ocorrencia;
  showModal.value = true;
};

const handleStatusChange = (newStatus: string) => {
  if (!ocorrenciaSelecionada.value) return;

  ocorrenciaSelecionada.value = {
    ...ocorrenciaSelecionada.value,
    status: newStatus as OcorrenciaStatus,
  };
};
</script>

<style scoped>
.list-enter-active {
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.list-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.list-move {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
