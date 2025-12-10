<template>
  <div
    class="min-h-screen p-4 sm:p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Fornecedores</h1>
    <!-- Header Controls -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      <!-- Search and Filter Toggle -->
      <div class="flex items-center gap-2 w-full md:max-w-xl">
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style="color: var(--color-text-muted)"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Pesquise o Fornecedor"
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
            class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"
          ></span>
        </button>
      </div>

      <!-- View Toggle -->
      <div
        class="flex items-center rounded-lg p-1 border self-start md:self-auto"
        style="
          background-color: var(--color-surface);
          border-color: var(--color-border);
        "
      >
        <button
          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          :style="[
            viewMode === 'list'
              ? {
                  backgroundColor: 'var(--color-hover)',
                  color: 'var(--color-text)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }
              : { color: 'var(--color-text-muted)' },
          ]"
          @click="viewMode = 'list'"
        >
          <List class="w-4 h-4" />
          Lista
        </button>
        <button
          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          :style="[
            viewMode === 'map'
              ? {
                  backgroundColor: 'var(--color-hover)',
                  color: 'var(--color-text)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }
              : { color: 'var(--color-text-muted)' },
          ]"
          @click="viewMode = 'map'"
        >
          <Map class="w-4 h-4" />
          Mapa
        </button>
      </div>
    </div>

    <!-- Collapsible Filters -->
    <div v-show="showFilters" class="mb-6">
      <FiltrosFornecedores v-model="filters" />
    </div>

    <!-- Content -->
    <div>
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <UiSpinner size="large" text="Carregando dados..." />
      </div>

      <!-- Data View -->
      <div v-else>
        <div v-if="viewMode === 'list'">
          <div
            class="mb-4 font-semibold text-sm"
            style="color: var(--color-primary)"
          >
            {{ fornecedores?.data.totalItems }} resultados
          </div>
          <ListaFornecedores
            :fornecedores="paginatedFornecedores"
            @select="handleSelectFornecedor"
          />

          <UiPaginacao
            v-model:page="currentPage"
            :total-items="fornecedores?.data.totalItems"
            :total-pages="fornecedores?.data.totalPages"
            class="mt-6"
          />
        </div>

        <div v-else>
          <MapaFornecedores :fornecedores="fornecedores?.data.items" />
        </div>
      </div>
    </div>

    <ModalDetalhesParceiro v-model="showModal" :parceiro="selectedFornecedor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search, Filter, List, Map } from "lucide-vue-next";
import ListaFornecedores from "../components/ListaFornecedores.vue";
import MapaFornecedores from "../components/MapaFornecedores.vue";
import FiltrosFornecedores from "../components/FiltrosFornecedores.vue";
import UiSpinner from "../../../components/ui/feedback/UiSpinner.vue";
import UiPaginacao from "@/components/ui/navigation/UiPaginacao.vue";
import ModalDetalhesParceiro from "../../painel/components/ModalDetalhesParceiro.vue";
import type { Fornecedor } from "../types/fornecedores";
import { useFornecedorService } from "../composables/useFornecedorService";

const showFilters = ref(false);
const viewMode = ref<"list" | "map">("list");
const currentPage = ref(1);
const itemsPerPage = ref(50);
const search = ref("");

const filters = ref({
  fantasia: "",
  cidade: "",
  status: "todos",
  sortBy: "fornecedor",
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (search.value) count++;
  if (filters.value.fantasia) count++;
  if (filters.value.cidade) count++;
  if (filters.value.status !== "todos") count++;
  if (filters.value.sortBy !== "fornecedor") count++;
  return count;
});

const { fetchFornecedor } = useFornecedorService();

const fornecedorFilters = computed(() => ({
  search: search.value,
  fantasia: filters.value.fantasia,
  cidade: filters.value.cidade,
  status: filters.value.status,
  sortBy: filters.value.sortBy,
}));

watch([search, filters], () => {
  currentPage.value = 1;
}, { deep: true });

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const {
  data: fornecedores,
  status,
} = fetchFornecedor(currentPage, itemsPerPage, fornecedorFilters);

const isLoading = computed(() => status.value === "pending");

const paginatedFornecedores = computed(() => fornecedores.value?.data.items ?? []);

const showModal = ref(false);
const selectedFornecedor = ref<any>(null);

const handleSelectFornecedor = (fornecedor: Fornecedor) => {
  selectedFornecedor.value = {
    ...fornecedor,
    name: fornecedor.fornecedor,
  };
  showModal.value = true;
};
</script>
