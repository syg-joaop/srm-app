<template>
  <div
    class="min-h-screen p-4 sm:p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Check-in</h1>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2 w-full md:max-w-xl">
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style="color: var(--color-text-muted)"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Pesquise o Check-in"
            class="w-full rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border"
            style="
              background-color: var(--color-surface);
              border-color: var(--color-border);
              color: var(--color-text);
            "
          />
        </div>

        <button
          class="p-2.5 rounded-lg border transition-colors relative"
          :style="[
            showFilters
              ? {
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  color: '#fff',
                }
              : {
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                },
          ]"
          @click="showFilters = !showFilters"
        >
          <Filter class="w-5 h-5" />
          <span
            v-if="activeFiltersCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full"
            style="background-color: var(--color-danger); color: #fff"
          >
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showFilters"
        class="mb-6 p-3 sm:p-4 rounded-lg border overflow-hidden"
        style="border-color: var(--color-border); background-color: var(--color-surface)"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--color-text-muted)">
              Fornecedor
            </label>
            <input
              v-model="filters.fornecedor"
              type="text"
              placeholder="Filtrar por fornecedor"
              class="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all border"
              style="
                background-color: var(--color-background);
                border-color: var(--color-border);
                color: var(--color-text);
              "
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--color-text-muted)">
              Responsavel
            </label>
            <input
              v-model="filters.responsavel"
              type="text"
              placeholder="Filtrar por responsavel"
              class="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all border"
              style="
                background-color: var(--color-background);
                border-color: var(--color-border);
                color: var(--color-text);
              "
            />
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--color-text-muted)">
              Cidade
            </label>
            <input
              v-model="filters.cidade"
              type="text"
              placeholder="Filtrar por cidade"
              class="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all border"
              style="
                background-color: var(--color-background);
                border-color: var(--color-border);
                color: var(--color-text);
              "
            />
          </div>
        </div>

        <button
          v-if="activeFiltersCount > 0"
          class="flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1.5 hover:opacity-80"
          style="color: var(--color-danger)"
          @click="clearFilters"
        >
          <X class="w-4 h-4" />
          Limpar filtros
        </button>
      </div>
    </Transition>

    <div>
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <UiSpinner size="large" text="Carregando dados..." />
      </div>

      <div v-else>
        <div class="mb-4 font-semibold text-sm" style="color: var(--color-primary)">
          {{ fallbackTotalItems }} resultados
        </div>

        <ListaCheckins
          v-if="paginatedCheckins.length > 0"
          :checkins="paginatedCheckins"
          @select="handleSelectCheckin"
        />

        <UiEmptyState
          v-else
          title="Nenhum check-in encontrado"
          description="Nao ha registros de check-in para os filtros selecionados."
        >
          <template #icon>
            <MapPin class="w-12 h-12" />
          </template>
        </UiEmptyState>

        <UiPaginacao
          v-if="paginatedCheckins.length > 0"
          v-model:page="currentPage"
          :total-items="fallbackTotalItems"
          :total-pages="totalPages"
          class="mt-6"
        />
      </div>
    </div>

    <ModalDetalhesCheckin v-model="showModal" :checkin="selectedCheckin" />
  </div>
</template>

<script setup lang="ts">
import { Filter, MapPin, Search, X } from "lucide-vue-next";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import ListaCheckins from "../components/ListaCheckins.vue";
import ModalDetalhesCheckin from "../components/ModalDetalhesCheckin.vue";
import type { Checkin, CheckinFilters } from "../checkin.types";

definePageMeta({ layout: "default" });

const showFilters = ref(false);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(50);

const filters = ref({
  fornecedor: "",
  responsavel: "",
  cidade: "",
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.fornecedor) count++;
  if (filters.value.responsavel) count++;
  if (filters.value.cidade) count++;
  return count;
});

const clearFilters = () => {
  filters.value = {
    fornecedor: "",
    responsavel: "",
    cidade: "",
  };
};

const { fetchCheckins } = useCheckinService();

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

const { data: checkinsResponse, status } = fetchCheckins(currentPage, itemsPerPage, checkinFilters);

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
    "â€”",
  cidade: toStringValue(raw.cidade) ?? toStringValue(raw.municipio),
  estado: toStringValue(raw.estado) ?? toStringValue(raw.uf),
  dataCheckin:
    toStringValue(raw.dataCheckin) ??
    toStringValue(raw.data_checkin) ??
    toStringValue(raw.data) ??
    toStringValue(raw.dataCadastro),
  responsavel:
    toStringValue(raw.responsavel) ??
    toStringValue(raw.usuario) ??
    toStringValue(raw.colaborador),
  observacao: toStringValue(raw.observacao) ?? toStringValue(raw.obs),
  status: toStringValue(raw.status) ?? toStringValue(raw.situacao),
  latitude: toNumber(raw.latitude) ?? toNumber(raw.lat),
  longitude: toNumber(raw.longitude) ?? toNumber(raw.lng),
});

const checkins = computed(() => (checkinsResponse.value?.data?.items ?? []).map(normalizeCheckin));

const fallbackTotalItems = computed(
  () => checkinsResponse.value?.data?.totalItems ?? checkins.value.length,
);

const totalPages = computed(
  () =>
    checkinsResponse.value?.data?.totalPages ??
    Math.max(1, Math.ceil((fallbackTotalItems.value || 0) / itemsPerPage.value)),
);

const paginatedCheckins = computed(() => {
  let items = checkins.value;

  if (search.value) {
    const normalizedSearch = search.value.toLowerCase();
    items = items.filter(
      (item) =>
        item.fornecedor.toLowerCase().includes(normalizedSearch) ||
        (item.responsavel ?? "").toLowerCase().includes(normalizedSearch),
    );
  }

  if (filters.value.fornecedor) {
    items = items.filter((item) =>
      item.fornecedor.toLowerCase().includes(filters.value.fornecedor.toLowerCase()),
    );
  }

  if (filters.value.responsavel) {
    items = items.filter((item) =>
      (item.responsavel ?? "").toLowerCase().includes(filters.value.responsavel.toLowerCase()),
    );
  }

  if (filters.value.cidade) {
    items = items.filter((item) =>
      (item.cidade ?? "").toLowerCase().includes(filters.value.cidade.toLowerCase()),
    );
  }

  if (checkinsResponse.value?.data?.totalPages) return items;

  const start = (currentPage.value - 1) * itemsPerPage.value;
  return items.slice(start, start + itemsPerPage.value);
});

const showModal = ref(false);
const selectedCheckin = ref<Checkin | null>(null);

const handleSelectCheckin = (checkin: Checkin) => {
  selectedCheckin.value = checkin;
  showModal.value = true;
};
</script>
