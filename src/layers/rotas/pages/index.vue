<template>
  <div class="min-h-screen p-4 sm:p-6 bg-[var(--color-background)]">
    <div class="flex flex-col gap-4 mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-[var(--color-text)]">Rotas cadastradas</h1>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <UiButton
          variant="primary"
          size="medium"
          class="whitespace-nowrap w-full sm:w-auto"
          @click="showNovaRotaModal = true"
        >
          <Plus class="w-4 h-4" />
          Nova Rota
        </UiButton>

        <UiCalendario
          :range="true"
          :start-date="filtroDataInicio"
          :end-date="filtroDataFim"
          placeholder="Filtrar período"
          class="w-full sm:w-auto"
          @change="handleDateChange"
        />
      </div>
    </div>

    <div
      class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-background)] rounded-t-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
    >
      <div class="col-span-6">Descrição</div>
      <div class="col-span-2 text-center">Status</div>
      <div class="col-span-4 text-end">Ações</div>
    </div>

    <div class="flex flex-col gap-1.5 md:gap-0">
      <div
        v-for="route in paginatedRoutes"
        :key="route.id"
        class="group/item relative bg-[var(--color-surface)] md:rounded-none first:md:rounded-t-none last:md:rounded-b-lg rounded-lg border border-[var(--color-border-subtle)] md:border-[var(--color-border)] md:border-t-0 first:md:border-t hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)] transition-all duration-300 ease-out hover:shadow-sm px-3 py-2.5 md:px-6 md:py-3 cursor-pointer"
      >
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-primary)] rounded-r-full opacity-0 group-hover/item:h-6 group-hover/item:opacity-100 transition-all duration-300"
        ></div>

        <div class="flex md:grid md:grid-cols-12 gap-2.5 md:gap-4 items-center">
          <div class="col-span-6 flex items-center gap-2.5 md:gap-3 flex-1 min-w-0">
            <div
              class="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary)] group-hover/item:scale-105 transition-transform duration-200"
            >
              <RouteIcon class="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div class="flex flex-col min-w-0">
              <span
                class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate"
              >
                {{ route.name }}
              </span>
              <span class="text-[11px] text-[var(--color-text-muted)] truncate">
                {{ route.dateRange }}
              </span>
              <span class="sm:inline hidden text-[11px] text-[var(--color-text-muted)] truncate">
                {{ route.suppliersCount }} fornecedor{{ route.suppliersCount !== 1 ? "es" : "" }}
              </span>
            </div>
          </div>

          <div class="hidden md:flex col-span-2 justify-center">
            <UiBadge :variant="getStatusVariant(route.status)" :dot="true" size="small">
              {{ getStatusLabel(route.status) }}
            </UiBadge>
          </div>

          <div class="col-span-4 flex items-center justify-end gap-1.5 md:gap-2">
            <UiButton variant="primary" size="small" class="hidden md:flex">
              <Plus class="w-3 h-3" />
              Adição rápida
            </UiButton>

            <UiButton variant="ghost" size="small" class="!px-1.5 !py-1.5 md:!px-2">
              <Eye class="w-4 h-4" />
              <span class="hidden md:inline">Detalhes</span>
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <UiPaginacao
      v-if="routes.length > 0"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      class="mt-6"
    />

    <UiEmptyState
      v-if="routes.length === 0"
      title="Nenhuma rota encontrada"
      description="Crie sua primeira rota para começar a organizar seus fornecedores."
    >
      <template #icon>
        <RouteIcon class="w-12 h-12" />
      </template>
      <template #action>
        <UiButton variant="primary" @click="showNovaRotaModal = true">
          <Plus class="w-4 h-4" />
          Nova Rota
        </UiButton>
      </template>
    </UiEmptyState>

    <ModalNovaRota v-model="showNovaRotaModal" @save="handleRouteCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, Eye, Route as RouteIcon } from "lucide-vue-next";
import UiButton from "~/components/ui/UiButton.vue";
import UiBadge from "~/components/ui/UiBadge.vue";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiCalendario from "~/components/ui/UiCalendario.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
import ModalNovaRota from "../components/ModalNovaRota.vue";

definePageMeta({
  layout: "default",
});

type RouteStatus = "pending" | "cancelled" | "completed";

interface RouteItem {
  id: number;
  name: string;
  dateRange: string;
  suppliersCount: number;
  status: RouteStatus;
}

const showNovaRotaModal = ref(false);
const filtroDataInicio = ref<Date | null>(null);
const filtroDataFim = ref<Date | null>(null);
const currentPage = ref(1);
const itemsPerPage = 10;

const routes = ref<RouteItem[]>([
  {
    id: 1,
    name: "Rota dos vinhedos",
    dateRange: "25/04 - 30/04",
    suppliersCount: 3,
    status: "pending",
  },
  {
    id: 2,
    name: "Rota 2",
    dateRange: "25/04 - 30/04",
    suppliersCount: 0,
    status: "cancelled",
  },
  {
    id: 3,
    name: "Rota 91",
    dateRange: "01/06 - 30/06",
    suppliersCount: 3,
    status: "completed",
  },
  {
    id: 4,
    name: "Rota dos vinhedos",
    dateRange: "25/04 - 30/04",
    suppliersCount: 3,
    status: "pending",
  },
]);

const totalPages = computed(() => Math.ceil(routes.value.length / itemsPerPage) || 1);

const paginatedRoutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return routes.value.slice(start, end);
});

const getStatusLabel = (status: RouteStatus): string => {
  const map: Record<RouteStatus, string> = {
    pending: "Pendente",
    cancelled: "Cancelada",
    completed: "Completo",
  };
  return map[status];
};

const getStatusVariant = (status: RouteStatus): string => {
  const map: Record<RouteStatus, string> = {
    pending: "warning",
    cancelled: "danger",
    completed: "success",
  };
  return map[status];
};

const handleDateChange = (value: { start: Date | null; end: Date | null }) => {
  filtroDataInicio.value = value.start;
  filtroDataFim.value = value.end;
};

const handleRouteCreated = () => {
  console.log("Rota criada com sucesso!");
};
</script>

<style scoped>
.group\/item:hover {
  transform: translateY(-1px);
}
</style>
