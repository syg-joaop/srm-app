<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header  com hierarquia clara -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Check-in
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
                placeholder="Pesquisar check-in..."
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
                    Fornecedor
                  </label>
                  <input
                    v-model="filters.fornecedor"
                    type="text"
                    placeholder="Filtrar por fornecedor"
                    class="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    Responsável
                  </label>
                  <input
                    v-model="filters.responsavel"
                    type="text"
                    placeholder="Filtrar por responsável"
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
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Contador -->
      <div class="mt-4">
        <p class="text-sm text-[var(--color-text-muted)] font-mono tabular-nums">
          {{ fallbackTotalItems }} {{ fallbackTotalItems === 1 ? "check-in" : "check-ins" }}
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
      :columns="{ title: 4, actions: 1 }"
      :extra-columns="[
        { span: 2, width: '60%' },
        { span: 3, width: '70%' },
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
        <div v-if="paginatedCheckins.length > 0">
          <!-- Header da tabela -->
          <div
            class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
          >
            <div class="col-span-4">Fornecedor</div>
            <div class="col-span-2">Data</div>
            <div class="col-span-3">Responsável</div>
            <div class="col-span-2">Observação</div>
            <div class="col-span-1 text-right">Ações</div>
          </div>

          <div class="flex flex-col gap-2 md:gap-0" role="list">
            <TransitionGroup name="list" tag="div" class="contents">
              <CheckinCardItem
                v-for="checkin in paginatedCheckins"
                :key="checkin.id"
                :checkin="checkin"
                @click="handleSelectCheckin"
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
              aria-label="Paginação de check-ins"
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
              <MapPin class="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
              {{ hasActiveFilters ? "Nenhum check-in encontrado" : "Nenhum check-in registrado" }}
            </h3>
            <p class="text-sm text-[var(--color-text-muted)] mb-6">
              {{
                hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a seleção."
                  : "Os check-ins aparecerão aqui quando registrados."
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

    <!-- Modal -->
    <ModalDetalhesCheckin v-model="showModal" :checkin="selectedCheckin" />
  </div>
</template>

<script setup lang="ts">
import { Filter, MapPin, Search, X } from "lucide-vue-next";
import { z } from "zod";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";
import { toNumber, toStringValue } from "~/utils/coerce";

import CheckinCardItem from "../components/CheckinCardItem.vue";
import ModalDetalhesCheckin from "../components/ModalDetalhesCheckin.vue";
import { checkinFiltersSchema, checkinSchema } from "../schemas/checkin.schema";

type Checkin = z.infer<typeof checkinSchema>;
type CheckinFilters = z.infer<typeof checkinFiltersSchema>;

definePageMeta({ layout: "default" });

const currentPage = ref(1);
const itemsPerPage = ref(50);
const showFilters = ref(false);

const filters = ref<CheckinFilters>({
  search: "",
  fornecedor: "",
  responsavel: "",
  cidade: "",
});

const { fetchCheckins } = useCheckinService();

const checkins = computed(() => (checkinsResponse.value?.data?.items ?? []).map(normalizeCheckin));

const { search, filteredItems: filteredCheckins } = useListFilter(checkins, {
  searchFields: ["fornecedor", "responsavel"],
  customFilters: (item) => {
    const fornecedor = filters.value.fornecedor?.trim().toLowerCase();
    const responsavel = filters.value.responsavel?.trim().toLowerCase();
    const cidade = filters.value.cidade?.trim().toLowerCase();

    if (fornecedor && !item.fornecedor?.toLowerCase().includes(fornecedor)) return false;
    if (responsavel && !(item.responsavel ?? "").toLowerCase().includes(responsavel)) return false;
    if (cidade && !(item.cidade ?? "").toLowerCase().includes(cidade)) return false;

    return true;
  },
});

const checkinFilters = computed<CheckinFilters>(() => ({
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

const { data: checkinsResponse, status } = await useAsyncData(
  "checkins",
  () => fetchCheckins(currentPage.value, itemsPerPage.value, checkinFilters.value),
  { watch: [currentPage, itemsPerPage, checkinFilters] },
);

const isLoading = computed(() => status.value === "pending");

const normalizeCheckin = (raw: Record<string, unknown>): Checkin => ({
  id:
    toNumber(raw.id) ??
    toNumber(raw.sr_recno) ??
    toNumber(raw.codigo) ??
    toNumber(raw.cod_checkin) ??
    Date.now(),
  fornecedor:
    toStringValue(raw.fornecedor) ??
    toStringValue(raw.empresa) ??
    toStringValue(raw.apelido) ??
    toStringValue(raw.nome) ??
    "-",
  cidade: toStringValue(raw.cidade) ?? toStringValue(raw.municipio),
  uf: toStringValue(raw.estado) ?? toStringValue(raw.uf),
  data:
    toStringValue(raw.dataCheckin) ??
    toStringValue(raw.data_checkin) ??
    toStringValue(raw.data) ??
    toStringValue(raw.dataCadastro),
  responsavel:
    toStringValue(raw.responsavel) ?? toStringValue(raw.usuario) ?? toStringValue(raw.colaborador),
  observacao: toStringValue(raw.observacao) ?? toStringValue(raw.obs),
  status: toStringValue(raw.status) ?? toStringValue(raw.situacao),
  latitude: toStringValue(raw.latitude) ?? toStringValue(raw.lat),
  longitude: toStringValue(raw.longitude) ?? toStringValue(raw.lng),
});

const fallbackTotalItems = computed(
  () => checkinsResponse.value?.data?.totalItems ?? filteredCheckins.value.length,
);

const totalPages = computed(
  () =>
    checkinsResponse.value?.data?.totalPages ??
    Math.max(1, Math.ceil((fallbackTotalItems.value || 0) / itemsPerPage.value)),
);

const paginatedCheckins = computed(() => {
  const items = filteredCheckins.value;
  if (checkinsResponse.value?.data?.totalPages) return items;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return items.slice(start, start + itemsPerPage.value);
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.fornecedor) count++;
  if (filters.value.responsavel) count++;
  if (filters.value.cidade) count++;
  return count;
});

const hasActiveFilters = computed(() => search.value || activeFiltersCount.value > 0);

const filterBadges = computed<FilterBadge[]>(() => {
  const badges: FilterBadge[] = [];
  if (search.value) {
    badges.push({ key: "search", label: "Busca", value: search.value });
  }
  if (filters.value.fornecedor) {
    badges.push({ key: "fornecedor", label: "Fornecedor", value: filters.value.fornecedor });
  }
  if (filters.value.responsavel) {
    badges.push({ key: "responsavel", label: "Responsável", value: filters.value.responsavel });
  }
  if (filters.value.cidade) {
    badges.push({ key: "cidade", label: "Cidade", value: filters.value.cidade });
  }
  return badges;
});

const handleRemoveFilter = (key: string) => {
  switch (key) {
    case "search":
      search.value = "";
      break;
    case "fornecedor":
      filters.value.fornecedor = "";
      break;
    case "responsavel":
      filters.value.responsavel = "";
      break;
    case "cidade":
      filters.value.cidade = "";
      break;
  }
};

const limparFiltros = () => {
  search.value = "";
  filters.value = {
    search: "",
    fornecedor: "",
    responsavel: "",
    cidade: "",
  };
  currentPage.value = 1;
};

const showModal = ref(false);
const selectedCheckin = ref<Checkin | null>(null);

const handleSelectCheckin = (checkin: Checkin) => {
  selectedCheckin.value = checkin;
  showModal.value = true;
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
