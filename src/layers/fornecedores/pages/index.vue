<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header refinado com hierarquia clara -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Fornecedores
          </h1>
        </div>
      </div>

      <!-- Toolbar com controles isolados -->
      <div class="sticky top-2 z-10">
        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Toggle Vista -->
            <UiSegmentedControl
              v-model="viewMode"
              :options="viewModeOptions"
              class="self-start md:self-auto"
            />

            <div class="hidden sm:block w-px h-6 bg-[var(--color-border)]"></div>

            <!-- Search -->
            <div class="relative flex-1 min-w-0">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Pesquisar fornecedor..."
                class="w-full h-10 pl-10 pr-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <!-- Filtros -->
            <div class="flex items-center gap-2">
              <!-- Status -->
              <div class="w-full sm:w-auto sm:min-w-[140px]">
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
                  @click="limparFiltros"
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
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    Fantasia
                  </label>
                  <input
                    v-model="filters.fantasia"
                    type="text"
                    placeholder="Filtrar por fantasia"
                    class="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    Cidade
                  </label>
                  <input
                    v-model="filters.cidade"
                    type="text"
                    placeholder="Filtrar por cidade"
                    class="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    Ordenar por
                  </label>
                  <UiSelect
                    v-model="filters.sortBy"
                    :options="sortOptions"
                    placeholder="Ordenar"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contador -->
      <div class="mt-4">
        <p class="text-sm text-[var(--color-text-muted)] font-mono tabular-nums">
          {{ totalItems }} {{ totalItems === 1 ? "fornecedor" : "fornecedores" }}
        </p>
      </div>
    </header>

    <!-- Badges de filtros ativos -->
    <UiFilterBadges
      :filters="filterBadges"
      @remove="handleRemoveFilter"
      @clear-all="limparFiltros"
    />

    <!-- Loading state -->
    <UiListSkeleton
      v-if="isLoading"
      :count="5"
      :show-progress="false"
      :columns="{ title: 4, status: 2, actions: 2 }"
      :extra-columns="[
        { span: 2, width: '60%' },
        { span: 2, width: '80%' },
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
        <!-- Vista Lista -->
        <div v-if="viewMode === 'list'">
          <!-- Header da tabela -->
          <div
            v-if="paginatedFornecedores.length > 0"
            class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
          >
            <div class="col-span-4">Fornecedor</div>
            <div class="col-span-2">Cidade</div>
            <div class="col-span-2">Última carga</div>
            <div class="col-span-2 text-center">Status</div>
            <div class="col-span-2 text-right">Ações</div>
          </div>

          <div class="flex flex-col gap-2 md:gap-0" role="list">
            <TransitionGroup name="list" tag="div" class="contents">
              <FornecedorCardItem
                v-for="fornecedor in paginatedFornecedores"
                :key="fornecedor.codfor"
                :fornecedor="fornecedor"
                @click="handleSelectFornecedor(fornecedor)"
                @add-route="handleAddToRoute(fornecedor)"
              />
            </TransitionGroup>
          </div>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <UiPaginacao
              v-if="paginatedFornecedores.length > 0"
              :page="currentPage"
              :total-pages="totalPages"
              class="mt-6"
              aria-label="Paginação de fornecedores"
              @update:page="(p) => (currentPage = p)"
            />
          </Transition>

          <!-- Empty state -->
          <div v-if="paginatedFornecedores.length === 0" class="py-20 text-center">
            <div class="max-w-md mx-auto">
              <div
                class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <Building2 class="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
                {{
                  hasActiveFilters ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor cadastrado"
                }}
              </h3>
              <p class="text-sm text-[var(--color-text-muted)] mb-6">
                {{
                  hasActiveFilters
                    ? "Tente ajustar os filtros ou limpar a seleção."
                    : "Os fornecedores aparecerão aqui quando cadastrados."
                }}
              </p>
              <button
                v-if="hasActiveFilters"
                class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
                @click="limparFiltros"
              >
                <X class="w-4 h-4" />
                <span>Limpar Filtros</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Vista Mapa -->
        <div v-else>
          <div
            class="h-[600px] w-full rounded-xl overflow-hidden border"
            style="border-color: var(--color-border)"
          >
            <UiMapaPontos :pontos="pontosFornecedores" :status-config="statusConfig" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modais -->
    <ModalDetalhesParceiro v-model="showModal" :parceiro="selectedFornecedor" variant="parceiro" />
    <ModalAdicionarARota
      v-model="showAddRouteModal"
      :fornecedor="fornecedorParaRota"
      @added="handleRouteAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { Building2, Filter, List, Map, Search, X } from "lucide-vue-next";
import { z } from "zod";

import ModalDetalhesParceiro from "~/components/common/ModalDetalhesParceiro.vue";
import { logger } from "~/utils/logger";

import FornecedorCardItem from "../components/FornecedorCardItem.vue";
import ModalAdicionarARota from "../components/ModalAdicionarARota.vue";
import { useFornecedoresFilters } from "../composables/useFornecedoresFilters";
import { useFornecedoresMap } from "../composables/useFornecedoresMap";
import {
  ORDENACAO_OPTIONS,
  PAGINACAO_PADRAO,
  STATUS_OPTIONS,
} from "../constants/fornecedor.constants";
import { fornecedorItemSchema } from "../schemas/fornecedores.schema";

import type { Rota } from "../../rotas/schemas/rotas.schema";

type Fornecedor = z.infer<typeof fornecedorItemSchema>;

type FornecedorParaModal = Fornecedor & { name?: string; codfor?: string };

definePageMeta({ layout: "default" });

// =============================================================================
// CONSTANTES E OPÇÕES
// =============================================================================

const viewModeOptions = [
  { label: "Lista", value: "list", icon: List },
  { label: "Mapa", value: "map", icon: Map },
];

const statusOptions = [...STATUS_OPTIONS];
const sortOptions = [...ORDENACAO_OPTIONS];

// =============================================================================
// ESTADO E COMPOSABLES
// =============================================================================

const viewMode = ref<"list" | "map">("list");
const currentPage = ref<number>(PAGINACAO_PADRAO.page);
const itemsPerPage = ref<number>(PAGINACAO_PADRAO.itemsPerPage);

const {
  search,
  filters,
  showFilters,
  totalFiltrosAtivos: activeFiltersCount,
  hasActiveFilters,
  filterBadges,
  apiFilters,
  removeFilter: handleRemoveFilter,
  clearAllFilters,
} = useFornecedoresFilters();

// =============================================================================
// DATA FETCHING
// =============================================================================

const { fetchFornecedor } = useFornecedorService();

const { data: fornecedores, status } = fetchFornecedor(currentPage, itemsPerPage, apiFilters);

const fornecedoresList = computed(() => fornecedores.value?.data?.items ?? []);
const totalItems = computed(() => fornecedores.value?.data?.totalItems ?? 0);
const totalPages = computed(() => fornecedores.value?.data?.totalPages ?? 1);
const isLoading = computed(() => status.value === "pending");

// Alias para manter compatibilidade com template
const paginatedFornecedores = fornecedoresList;

// =============================================================================
// MAPA
// =============================================================================

const { statusConfig, pontosFornecedores } = useFornecedoresMap(fornecedoresList);

// =============================================================================
// WATCHERS
// =============================================================================

watch([search, filters], () => (currentPage.value = 1), { deep: true });
watch(currentPage, () => window.scrollTo({ top: 0, behavior: "smooth" }));

// =============================================================================
// HANDLERS
// =============================================================================

const limparFiltros = () => {
  clearAllFilters();
  currentPage.value = 1;
};

// Modal de detalhes
const showModal = ref(false);
const selectedFornecedor = ref<FornecedorParaModal | null>(null);

const handleSelectFornecedor = (fornecedor: Fornecedor) => {
  const codigoFornecedor =
    typeof fornecedor.codfor === "number" ? String(fornecedor.codfor) : fornecedor.codfor;

  selectedFornecedor.value = {
    ...fornecedor,
    codfor: codigoFornecedor,
    name: fornecedor.fornecedor,
  };
  showModal.value = true;
};

// Modal de adicionar à rota
const showAddRouteModal = ref(false);
const fornecedorParaRota = ref<Fornecedor | null>(null);

const handleAddToRoute = (fornecedor: Fornecedor) => {
  fornecedorParaRota.value = fornecedor;
  showAddRouteModal.value = true;
};

const handleRouteAdded = (rota: Rota) => {
  logger.info("Fornecedor adicionado à rota:", rota.id);
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
