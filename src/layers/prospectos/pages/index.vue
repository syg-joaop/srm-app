<template>
  <div
    class="min-h-screen p-4 sm:p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Prospectos</h1>
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
            placeholder="Pesquise o Prospecto"
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

      <UiSegmentedControl
        v-model="viewMode"
        :options="viewModeOptions"
        class="self-start md:self-auto"
      />
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--color-text-muted)">
              Fantasia
            </label>
            <input
              v-model="filters.fantasia"
              type="text"
              placeholder="Filtrar por fantasia"
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

          <div class="space-y-2">
            <label
              class="block text-xs font-semibold uppercase tracking-wide"
              style="color: var(--color-text-muted)"
            >
              Status
            </label>
            <UiSegmentedControl v-model="filters.status" :options="statusOptions" full-width />
          </div>

          <div class="space-y-2">
            <label
              class="block text-xs font-semibold uppercase tracking-wide"
              style="color: var(--color-text-muted)"
            >
              Ordenar por
            </label>
            <UiSegmentedControl
              v-model="filters.sortBy"
              :options="sortOptions"
              mobile-size="xs"
              full-width
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
        <div v-if="viewMode === 'list'">
          <div class="mb-4 font-semibold text-sm" style="color: var(--color-primary)">
            {{ prospectos?.data.totalItems }} resultados
          </div>
          <ListaProspectos :prospectos="paginatedProspectos" @select="handleSelectProspecto" />

          <UiPaginacao
            v-model:page="currentPage"
            :total-items="prospectos?.data.totalItems"
            :total-pages="prospectos?.data.totalPages"
            class="mt-6"
          />
        </div>

        <div v-else>
          <MapaProspectos :prospectos="prospectos?.data.items" />
        </div>
      </div>
    </div>

    <ModalDetalhesParceiro v-model="showModal" :parceiro="selectedProspecto" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search, Filter, List, Map, X } from "lucide-vue-next";
import ListaProspectos from "../components/ListaProspectos.vue";
import MapaProspectos from "../components/MapaProspectos.vue";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
import UiSegmentedControl from "~/components/ui/UiSegmentedControl.vue";
import ModalDetalhesParceiro from "~/components/common/ModalDetalhesParceiro.vue";
import type { Prospecto } from "../prospecto.types";
import { useProspectoService } from "../composables/useProspectoService";

const showFilters = ref(false);
const viewMode = ref<"list" | "map">("list");
const currentPage = ref(1);
const itemsPerPage = ref(50);
const search = ref("");

const filters = ref({
  fantasia: "",
  cidade: "",
  status: "todos",
  sortBy: "prospecto",
});

const viewModeOptions = [
  { label: "Lista", value: "list", icon: List },
  { label: "Mapa", value: "map", icon: Map },
];

const statusOptions = [
  { label: "Todos", value: "todos" },
  { label: "Ativo", value: "ativo" },
  { label: "Novo", value: "novo" },
  { label: "Inativo", value: "inativo" },
];

const sortOptions = [
  { label: "Prospecto", value: "prospecto" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Interação +60 dias", value: "sem_interacao" },
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.fantasia) count++;
  if (filters.value.cidade) count++;
  if (filters.value.status !== "todos") count++;
  if (filters.value.sortBy !== "prospecto") count++;
  return count;
});

const clearFilters = () => {
  filters.value = {
    fantasia: "",
    cidade: "",
    status: "todos",
    sortBy: "prospecto",
  };
};

const { fetchProspecto } = useProspectoService();

const prospectoFilters = computed(() => ({
  search: search.value,
  fantasia: filters.value.fantasia,
  cidade: filters.value.cidade,
  status: filters.value.status,
  sortBy: filters.value.sortBy,
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

const { data: prospectos, status } = fetchProspecto(currentPage, itemsPerPage, prospectoFilters);

const isLoading = computed(() => status.value === "pending");

const paginatedProspectos = computed(() => prospectos.value?.data.items ?? []);

const showModal = ref(false);
const selectedProspecto = ref<any>(null);

const handleSelectProspecto = (prospecto: Prospecto) => {
  selectedProspecto.value = {
    ...prospecto,
    name: prospecto.prospecto, // Modal usa `name` como título
  };
  showModal.value = true;
};
</script>
