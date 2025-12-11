<template>
  <div
    class="min-h-screen p-4 sm:p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Fornecedores</h1>
    <!-- Header Controls -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
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
            class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full"
            style="background-color: var(--color-danger); color: #fff"
          >
            {{ activeFiltersCount }}
          </span>
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
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showFilters"
        class="mb-6 p-3 sm:p-4 rounded-lg border"
        style="border-color: var(--color-border); background-color: var(--color-surface)"
      >
        <!-- Filtros tipo Input -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--color-text-muted)">
              Fantasia
            </label>
            <input
              v-model="filters.fantasia"
              type="text"
              placeholder="Filtrar por fantasia"
              class="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all border"
              style="background-color: var(--color-background); border-color: var(--color-border); color: var(--color-text)"
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
              style="background-color: var(--color-background); border-color: var(--color-border); color: var(--color-text)"
            />
          </div>
        </div>

        <!-- Filtros tipo Button Group -->
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <div class="space-y-2">
            <label class="block text-sm font-semibold" style="color: var(--color-text)">
              Status
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
                :style="[
                  filters.status === option.value
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
                @click="filters.status = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold" style="color: var(--color-text)">
              Ordenar por
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
                :style="[
                  filters.sortBy === option.value
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
                @click="filters.sortBy = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Botão Limpar -->
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
import { Search, Filter, List, Map, X } from "lucide-vue-next";
import ListaFornecedores from "../components/ListaFornecedores.vue";
import MapaFornecedores from "../components/MapaFornecedores.vue";
import UiSpinner from "@/components/ui/feedback/UiSpinner.vue";
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

const statusOptions = [
  { label: "Todos", value: "todos" },
  { label: "Ativo", value: "ativo" },
  { label: "Inativo", value: "inativo" },
];

const sortOptions = [
  { label: "Fornecedor", value: "fornecedor" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Sem carga +60 dias", value: "sem_carga" },
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.fantasia) count++;
  if (filters.value.cidade) count++;
  if (filters.value.status !== "todos") count++;
  if (filters.value.sortBy !== "fornecedor") count++;
  return count;
});

const clearFilters = () => {
  filters.value = {
    fantasia: "",
    cidade: "",
    status: "todos",
    sortBy: "fornecedor",
  };
};

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
