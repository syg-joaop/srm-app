<template>
  <div
    class="min-h-screen p-4 sm:p-6 pb-20 transition-colors"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Prospectos</h1>
    <UiListToolbar
      v-model:search="search"
      v-model:filters="filters"
      :filter-items="filterItems"
      :input-columns="4"
      search-placeholder="Pesquise o Prospecto"
    >
      <template #actions>
        <UiSegmentedControl
          v-model="viewMode"
          :options="viewModeOptions"
          class="self-start md:self-auto"
        />
      </template>
    </UiListToolbar>

    <div>
      <div v-if="viewMode === 'list'">
        <div class="mb-4 font-semibold text-sm" style="color: var(--color-primary)">
          {{ prospectos?.data?.totalItems ?? 0 }} resultados
        </div>
        <ListaProspectos :prospectos="paginatedProspectos" @select="handleSelectProspecto" />

        <UiPaginacao
          v-model:page="currentPage"
          :total-items="prospectos?.data?.totalItems ?? 0"
          :total-pages="prospectos?.data?.totalPages ?? 0"
          class="mt-6"
        />
      </div>

      <div v-else>
        <MapaProspectos :prospectos="prospectos?.data?.items ?? []" />
      </div>
    </div>

    <ModalDetalhesParceiro v-model="showModal" :parceiro="selectedProspecto" variant="parceiro" />
  </div>
</template>

<script setup lang="ts">
import { List, Map } from "lucide-vue-next";
import { z } from "zod";

import ModalDetalhesParceiro from "~/components/common/ModalDetalhesParceiro.vue";

import ListaProspectos from "../components/ListaProspectos.vue";
import MapaProspectos from "../components/MapaProspectos.vue";
import { prospectoItemSchema } from "../schemas/prospectos.schema";

import type { ParceiroData } from "~/types/parceiro";

type Prospecto = z.infer<typeof prospectoItemSchema>;

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
  { label: "Fornecedor", value: "fornecedor" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Carga +60 dias", value: "sem_carga" },
];

const filterItems = [
  {
    key: "fantasia",
    label: "Fantasia",
    type: "input" as const,
    placeholder: "Filtrar por fantasia",
    defaultValue: "",
  },
  {
    key: "cidade",
    label: "Cidade",
    type: "input" as const,
    placeholder: "Filtrar por cidade",
    defaultValue: "",
  },
  {
    key: "status",
    label: "Status",
    type: "segmented" as const,
    options: statusOptions,
    defaultValue: "todos",
    segmentedFullWidth: true,
  },
  {
    key: "sortBy",
    label: "Ordenar por",
    type: "segmented" as const,
    options: sortOptions,
    defaultValue: "fornecedor",
    segmentedFullWidth: true,
    segmentedMobileSize: "xs" as const,
  },
];

const { fetchProspectos } = useProspectoService();

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

const { data: prospectos } = fetchProspectos(currentPage, itemsPerPage, prospectoFilters);

const paginatedProspectos = computed(() => prospectos.value?.data?.items ?? []);

const showModal = ref(false);
const selectedProspecto = ref<ParceiroData | null>(null);

const handleSelectProspecto = (prospecto: Prospecto) => {
  selectedProspecto.value = {
    name: prospecto.fornecedor,
    fornecedor: prospecto.fornecedor,
    fanta: prospecto.fanta,
    status: prospecto.status,
    cidade: prospecto.cidade,
    uf: prospecto.uf,
    codfor: prospecto.codfor ? String(prospecto.codfor) : undefined,
    codpros: undefined,
    categoria: prospecto.categoria,
    ende: prospecto.ende,
    comp: prospecto.comp,
    fone: prospecto.fone,
    celular: prospecto.celular,
    tel3: prospecto.tel3,
    email: prospecto.email,
    ultima_carga: prospecto.ultima_carga,
    latitude: prospecto.latitude,
    longitude: prospecto.longitude,
    latlong: prospecto.latlong,
  } as ParceiroData;
  showModal.value = true;
};
</script>
