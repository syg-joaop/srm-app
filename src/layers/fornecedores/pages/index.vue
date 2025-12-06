<template>
  <div
    class="min-h-screen p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-2xl font-bold mb-6">Fornecedores</h1>
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
      <SupplierFilters v-model="filters" />
    </div>

    <!-- Content -->
    <div>
      <div v-if="viewMode === 'list'">
        <div
          class="mb-4 font-semibold text-sm"
          style="color: var(--color-primary)"
        >
          {{ filteredSuppliers.length }} resultados
        </div>
        <SupplierList :suppliers="filteredSuppliers" />

        <!-- Pagination Placeholder -->
        <div class="mt-6 flex justify-center gap-2">
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors"
            style="
              background-color: var(--color-surface);
              border-color: var(--color-border);
              color: var(--color-text-muted);
            "
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg font-bold"
            style="background-color: var(--color-primary); color: #fff"
          >
            1
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg border transition-colors"
            style="
              background-color: var(--color-surface);
              border-color: var(--color-border);
              color: var(--color-text-muted);
            "
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-else>
        <SupplierMap :suppliers="filteredSuppliers" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Search,
  Filter,
  List,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import SupplierList from "../components/SupplierList.vue";
import SupplierMap from "../components/SupplierMap.vue";
import SupplierFilters from "../components/SupplierFilters.vue";
import type { Fornecedor } from "../types/fornecedores";
import { useFornecedorService } from "../composables/useFornecedorService";
import { mapFornecedorToSupplier } from "../utils/supplierMapper";
import { useListFilter } from "../../../composables/ui/useListFilter";

const { fetchFornecedor } = useFornecedorService();
const { data: fornecedores, status } = fetchFornecedor();

const isLoading = computed(() => status.value === "pending");
const showFilters = ref(false);
const viewMode = ref<"list" | "map">("list");

const filters = ref({
  fantasia: "",
  cidade: "",
  status: "todos",
  sortBy: "fornecedor",
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.fantasia) count++;
  if (filters.value.cidade) count++;
  if (filters.value.status !== "todos") count++;
  if (filters.value.sortBy !== "fornecedor") count++;
  return count;
});

const listaFornecedores = computed(() => fornecedores.value?.data ?? []);

const mapStatusFilter = (filter: string): Fornecedor["status"] | null => {
  const map: Record<string, Fornecedor["status"]> = {
    ativo: "ativo",
    inativo: "inativo",
    alerta: "alerta",
  };
  return map[filter.trim().toLowerCase()] || null;
};

const filterConfig = computed(() => ({
  searchFields: ["fornecedor", "fanta", "cidade"] as (keyof Fornecedor)[],
  
  customFilters: (s: Fornecedor) => {
    const f = filters.value;
    
    const matchFantasia = !f.fantasia || 
      (s.fanta ?? "").toLowerCase().includes(f.fantasia.toLowerCase());
      
    const matchCidade = !f.cidade || 
      s.cidade.toLowerCase().includes(f.cidade.toLowerCase());

    const statusTarget = mapStatusFilter(f.status);
    const matchStatus = f.status === "todos" || s.status === statusTarget;

    return matchFantasia && matchCidade && matchStatus;
  },

  sortCompare: (a: Fornecedor, b: Fornecedor) => {
    const sortBy = filters.value.sortBy;
    if (sortBy === "cidade") {
      return a.cidade.localeCompare(b.cidade);
    } 
    if (sortBy === "status") {
      const normalizar = (status: string) => status.trim().toLowerCase();
      const order: Record<string, number> = {
        ativo: 1,
        alerta: 2,
        inativo: 3,
      };
      return (order[normalizar(a.status)] ?? 99) - (order[normalizar(b.status)] ?? 99);
    }
    return a.fornecedor.localeCompare(b.fornecedor);
  }
}));

const { search, filteredItems: fornecedoresFiltrados } = useListFilter(
  listaFornecedores,
  filterConfig
);

const filteredSuppliers = computed(() =>
  fornecedoresFiltrados.value.map(mapFornecedorToSupplier)
);

</script>
