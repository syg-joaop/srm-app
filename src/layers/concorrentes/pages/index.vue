<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header refinado com hierarquia clara -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Concorrentes
          </h1>
        </div>
      </div>

      <!-- Toolbar com controles isolados -->
      <div class="sticky top-2 z-10">
        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1 min-w-0">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Pesquisar concorrente..."
                class="w-full h-10 pl-10 pr-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <!-- Filtros -->
            <div class="flex items-center gap-2">
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
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    Nome
                  </label>
                  <input
                    v-model="filters.nome"
                    type="text"
                    placeholder="Filtrar por nome"
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
                    Segmento
                  </label>
                  <input
                    v-model="filters.segmento"
                    type="text"
                    placeholder="Filtrar por segmento"
                    class="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
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
          {{ fallbackTotalItems }} {{ fallbackTotalItems === 1 ? "concorrente" : "concorrentes" }}
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
      :show-status="false"
      :columns="{ title: 4, actions: 2 }"
      :extra-columns="[
        { span: 2, width: '70%' },
        { span: 2, width: '50%' },
        { span: 2, width: '60%' },
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
        <div v-if="paginatedConcorrentes.length > 0">
          <!-- Header da tabela -->
          <div
            class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
          >
            <div class="col-span-4">Nome</div>
            <div class="col-span-2">Cidade</div>
            <div class="col-span-2">Segmento</div>
            <div class="col-span-2">Telefone</div>
            <div class="col-span-2 text-right">Ações</div>
          </div>

          <div class="flex flex-col gap-2 md:gap-0" role="list">
            <TransitionGroup name="list" tag="div" class="contents">
              <ConcorrenteCardItem
                v-for="concorrente in paginatedConcorrentes"
                :key="concorrente.id"
                :concorrente="concorrente"
                @click="handleSelectConcorrente"
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
              aria-label="Paginação de concorrentes"
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
              <Users class="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
              {{ hasActiveFilters ? "Nenhum concorrente encontrado" : "Nenhum concorrente cadastrado" }}
            </h3>
            <p class="text-sm text-[var(--color-text-muted)] mb-6">
              {{
                hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a seleção."
                  : "Os concorrentes aparecerão aqui quando cadastrados."
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Filter, Search, Users, X } from "lucide-vue-next";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";
import { logger } from "~/utils/logger";
import { toNumber, toStringValue } from "~/utils/coerce";

import ConcorrenteCardItem from "../components/ConcorrenteCardItem.vue";
import type { Concorrente, ConcorrenteFilters } from "../schemas/concorrentes.schema";

definePageMeta({ layout: "default" });

const currentPage = ref(1);
const itemsPerPage = ref(50);
const showFilters = ref(false);

const filters = ref({
  nome: "",
  cidade: "",
  segmento: "",
});

const { fetchConcorrentes } = useConcorrenteService();

const concorrentes = computed(() =>
  (concorrentesResponse.value?.data?.items ?? []).map(normalizeConcorrente),
);

const { search, filteredItems: filteredConcorrentes } = useListFilter(concorrentes, {
  searchFields: ["nome"],
  customFilters: (item) => {
    const nome = filters.value.nome.trim().toLowerCase();
    const cidade = filters.value.cidade.trim().toLowerCase();
    const segmento = filters.value.segmento.trim().toLowerCase();

    if (nome && !item.nome.toLowerCase().includes(nome)) return false;
    if (cidade && !(item.cidade ?? "").toLowerCase().includes(cidade)) return false;
    if (segmento && !(item.segmento ?? "").toLowerCase().includes(segmento)) return false;

    return true;
  },
});

const concorrenteFilters = computed<ConcorrenteFilters>(() => ({
  search: search.value,
}));

watch(
  [search, filters],
  () => {
    currentPage.value = 1;
  },
  { deep: true },
);

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const { data: concorrentesResponse, status } = fetchConcorrentes(
  currentPage,
  itemsPerPage,
  concorrenteFilters,
);

const isLoading = computed(() => status.value === "pending");

const normalizeConcorrente = (raw: Record<string, unknown>): Concorrente => ({
  id:
    toNumber(raw.id) ??
    toNumber(raw.sr_recno) ??
    toNumber(raw.codigo) ??
    toNumber(raw.cod_concorrente) ??
    Date.now(),
  nome:
    toStringValue(raw.nome) ??
    toStringValue(raw.concorrente) ??
    toStringValue(raw.empresa) ??
    toStringValue(raw.apelido) ??
    "-",
  cidade: toStringValue(raw.cidade) ?? toStringValue(raw.municipio),
  estado: toStringValue(raw.estado) ?? toStringValue(raw.uf),
  telefone: toStringValue(raw.telefone) ?? toStringValue(raw.celular) ?? toStringValue(raw.fone),
  segmento: toStringValue(raw.segmento) ?? toStringValue(raw.categoria),
  observacao: toStringValue(raw.observacao) ?? toStringValue(raw.obs),
  status: toStringValue(raw.status) ?? toStringValue(raw.situacao),
});

const fallbackTotalItems = computed(
  () => concorrentesResponse.value?.data?.totalItems ?? filteredConcorrentes.value.length,
);

const totalPages = computed(
  () =>
    concorrentesResponse.value?.data?.totalPages ??
    Math.max(1, Math.ceil((fallbackTotalItems.value || 0) / itemsPerPage.value)),
);

const paginatedConcorrentes = computed(() => {
  const items = filteredConcorrentes.value;
  if (concorrentesResponse.value?.data?.totalPages) return items;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return items.slice(start, start + itemsPerPage.value);
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.nome) count++;
  if (filters.value.cidade) count++;
  if (filters.value.segmento) count++;
  return count;
});

const hasActiveFilters = computed(() => search.value || activeFiltersCount.value > 0);

const filterBadges = computed<FilterBadge[]>(() => {
  const badges: FilterBadge[] = [];
  if (search.value) {
    badges.push({ key: "search", label: "Busca", value: search.value });
  }
  if (filters.value.nome) {
    badges.push({ key: "nome", label: "Nome", value: filters.value.nome });
  }
  if (filters.value.cidade) {
    badges.push({ key: "cidade", label: "Cidade", value: filters.value.cidade });
  }
  if (filters.value.segmento) {
    badges.push({ key: "segmento", label: "Segmento", value: filters.value.segmento });
  }
  return badges;
});

const handleRemoveFilter = (key: string) => {
  switch (key) {
    case "search":
      search.value = "";
      break;
    case "nome":
      filters.value.nome = "";
      break;
    case "cidade":
      filters.value.cidade = "";
      break;
    case "segmento":
      filters.value.segmento = "";
      break;
  }
};

const limparFiltros = () => {
  search.value = "";
  filters.value = {
    nome: "",
    cidade: "",
    segmento: "",
  };
  currentPage.value = 1;
};

const handleSelectConcorrente = (concorrente: Concorrente) => {
  logger.info("Selected concorrente:", concorrente);
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
