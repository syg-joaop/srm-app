<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header refinado com hierarquia clara -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Rotas
          </h1>
        </div>
      </div>

      <!-- Toolbar com controles isolados -->
      <div class="sticky top-2 z-10">
        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Ação primária -->
            <button
              class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
              @click="showNovaRotaModal = true"
              aria-label="Criar nova rota"
            >
              <Plus class="w-4 h-4" />
              <span>Nova Rota</span>
            </button>

            <div class="hidden sm:block w-px h-6 bg-[var(--color-border)]"></div>

            <!-- Filtros -->
            <div class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <!-- Calendário -->
              <div class="relative flex-1 min-w-0 z-[100]">
                <UiCalendario
                  :range="true"
                  :start-date="filtroDataInicio"
                  :end-date="filtroDataFim"
                  placeholder="Selecionar período"
                  class="w-full"
                  aria-label="Filtrar rotas por período"
                  @change="
                    (value) => handleDateChange(value as { start: Date | null; end: Date | null })
                  "
                />
              </div>

              <!-- Status -->
              <div class="w-full sm:w-auto sm:min-w-[180px] z-[50]">
                <UiSelect
                  :model-value="filtroStatusSelect"
                  :options="statusFilterOptions"
                  placeholder="Status"
                  class="w-full"
                  @update:model-value="handleStatusFilterChange"
                />
              </div>

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
                  v-if="filtroDataInicio || filtroDataFim || filtroStatus"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-hover)] hover:border-[var(--color-danger)] active:scale-95 transition-all duration-150 group sm:self-center"
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
        </div>
      </div>

      <!-- Contador de rotas abaixo da toolbar -->
      <div class="mt-4">
        <p class="text-sm text-[var(--color-text-muted)] font-mono tabular-nums">
          {{ totalItems }} {{ totalItems === 1 ? "rota" : "rotas" }}
        </p>
      </div>
    </header>

    <!-- Badges de filtros ativos -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="filtroDataInicio || filtroDataFim || filtroStatus"
        class="flex items-center gap-2 mb-6"
      >
        <span class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
          Filtros ativos
        </span>
        <div class="flex items-center gap-2">
          <span
            v-if="filtroDataInicio"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text)]"
          >
            Desde {{ formatarData(filtroDataInicio.toISOString()) }}
          </span>
          <span
            v-if="filtroDataFim"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs font-mono text-[var(--color-text)]"
          >
            Até {{ formatarData(filtroDataFim.toISOString()) }}
          </span>
          <span
            v-if="filtroStatus"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-primary-soft)] border border-[var(--color-primary-border)] rounded-md text-xs font-medium text-[var(--color-primary)]"
          >
            {{ statusFilters.find((f) => f.value === filtroStatus)?.label }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- Loading state refinado -->
    <div v-if="isLoading" class="space-y-2" aria-hidden="true">
      <div
        v-for="i in 5"
        :key="`skeleton-${i}`"
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4"
      >
        <div class="grid grid-cols-12 gap-4 items-center">
          <div class="col-span-5 space-y-2">
            <div class="h-4 w-2/3 bg-[var(--color-hover)] rounded animate-pulse"></div>
            <div class="h-3 w-1/2 bg-[var(--color-hover)] rounded animate-pulse"></div>
          </div>
          <div class="col-span-2 flex justify-center">
            <div class="h-2 w-24 bg-[var(--color-hover)] rounded-full animate-pulse"></div>
          </div>
          <div class="col-span-2 flex justify-center">
            <div class="h-5 w-16 bg-[var(--color-hover)] rounded-full animate-pulse"></div>
          </div>
          <div class="col-span-3 flex justify-end gap-2">
            <div class="h-8 w-8 bg-[var(--color-hover)] rounded animate-pulse"></div>
            <div class="h-8 w-8 bg-[var(--color-hover)] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <UiEmptyState
        v-if="error"
        class="py-16"
        title="Erro ao carregar rotas"
        :description="error"
        role="alert"
        aria-live="polite"
      >
        <template #icon>
          <TriangleAlert class="w-12 h-12 text-red-500" />
        </template>
        <template #action>
          <UiButton variant="primary" size="small" @click="recarregarRotas">
            Tentar novamente
          </UiButton>
        </template>
      </UiEmptyState>
    </Transition>

    <!-- Content -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="!isLoading && !error">
        <!-- Header da tabela com ordenação -->
        <div
          v-if="rotas.length > 0"
          class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
          role="row"
        >
          <button
            class="col-span-5 flex items-center gap-1.5 text-left hover:text-[var(--color-text)] transition-colors group"
            @click="toggleSort('codigo')"
            role="columnheader"
          >
            <span>Descrição</span>
            <div
              class="inline-flex flex-col -space-y-1 opacity-40 group-hover:opacity-100 transition-opacity"
            >
              <ChevronUp
                class="w-3 h-3"
                :class="
                  sortField === 'codigo' && sortOrder === 'asc' ? 'text-[var(--color-primary)]' : ''
                "
              />
              <ChevronDown
                class="w-3 h-3"
                :class="
                  sortField === 'codigo' && sortOrder === 'desc'
                    ? 'text-[var(--color-primary)]'
                    : ''
                "
              />
            </div>
          </button>
          <button
            class="col-span-2 flex items-center justify-center gap-1.5 hover:text-[var(--color-text)] transition-colors group"
            @click="toggleSort('progresso')"
            role="columnheader"
          >
            <span>Progresso</span>
            <div
              class="inline-flex flex-col -space-y-1 opacity-40 group-hover:opacity-100 transition-opacity"
            >
              <ChevronUp
                class="w-3 h-3"
                :class="
                  sortField === 'progresso' && sortOrder === 'asc'
                    ? 'text-[var(--color-primary)]'
                    : ''
                "
              />
              <ChevronDown
                class="w-3 h-3"
                :class="
                  sortField === 'progresso' && sortOrder === 'desc'
                    ? 'text-[var(--color-primary)]'
                    : ''
                "
              />
            </div>
          </button>
          <button
            class="col-span-2 flex items-center justify-center gap-1.5 hover:text-[var(--color-text)] transition-colors group"
            @click="toggleSort('status')"
            role="columnheader"
          >
            <span>Status</span>
            <div
              class="inline-flex flex-col -space-y-1 opacity-40 group-hover:opacity-100 transition-opacity"
            >
              <ChevronUp
                class="w-3 h-3"
                :class="
                  sortField === 'status' && sortOrder === 'asc' ? 'text-[var(--color-primary)]' : ''
                "
              />
              <ChevronDown
                class="w-3 h-3"
                :class="
                  sortField === 'status' && sortOrder === 'desc'
                    ? 'text-[var(--color-primary)]'
                    : ''
                "
              />
            </div>
          </button>
          <div class="col-span-3 text-right" role="columnheader">Ações</div>
        </div>

        <div class="flex flex-col gap-2 md:gap-0" role="list">
          <TransitionGroup name="list" tag="div" class="contents">
            <RotaCardItem
              v-for="rota in rotasPaginadas"
              :key="rota.id"
              :rota="rota"
              @click="abrirDetalhes"
              @adicao-rapida="adicionarRapido"
            />
          </TransitionGroup>
        </div>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <UiPaginacao
            v-if="rotas.length > 0"
            :page="currentPage"
            :total-pages="totalPages"
            class="mt-6"
            aria-label="Paginação de rotas"
            @update:page="(p) => (currentPage = p)"
          />
        </Transition>

        <!-- Empty state refinado -->
        <div v-if="rotas.length === 0" class="py-20 text-center">
          <div class="max-w-md mx-auto">
            <!-- Ícone -->
            <div
              class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <svg
                class="w-8 h-8 text-[var(--color-text-muted)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M2 17L12 22L22 17" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2 12L12 17L22 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <!-- Texto -->
            <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
              {{
                filtroDataInicio || filtroDataFim || filtroStatus
                  ? "Nenhuma rota encontrada"
                  : "Nenhuma rota criada"
              }}
            </h3>
            <p class="text-sm text-[var(--color-text-muted)] mb-6">
              {{
                filtroDataInicio || filtroDataFim || filtroStatus
                  ? "Tente ajustar os filtros ou limpar a seleção."
                  : "Comece criando sua primeira rota para gerenciar suas entregas."
              }}
            </p>

            <!-- Ação -->
            <button
              class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
              @click="
                filtroDataInicio || filtroDataFim || filtroStatus
                  ? limparFiltros()
                  : (showNovaRotaModal = true)
              "
            >
              <component
                :is="filtroDataInicio || filtroDataFim || filtroStatus ? X : Plus"
                class="w-4 h-4"
              />
              <span>
                {{
                  filtroDataInicio || filtroDataFim || filtroStatus
                    ? "Limpar Filtros"
                    : "Criar Primeira Rota"
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modais -->
    <ModalNovaRota v-model="showNovaRotaModal" @save="handleRouteCreated" />
    <ModalDetalhesRota
      v-model="showDetalhesModal"
      :rota="rotaSelecionada"
      :user-location="userLocation"
    />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronUp, Plus, TriangleAlert, X } from "lucide-vue-next";

import { formatarData } from "~/utils/formatters/date";
import { logger } from "~/utils/logger";

import ModalDetalhesRota from "../components/ModalDetalhesRota.vue";
import ModalNovaRota from "../components/ModalNovaRota.vue";
import RotaCardItem from "../components/RotaCardItem.vue";

import type { Rota, RotaFilters } from "../schemas/rotas.schema";

definePageMeta({
  layout: "default",
});

const showNovaRotaModal = ref(false);
const showDetalhesModal = ref(false);
const rotaSelecionada = ref<Rota | null>(null);
const filtroDataInicio = ref<Date | null>(null);
const filtroDataFim = ref<Date | null>(null);
const filtroStatus = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const sortField = ref<"codigo" | "progresso" | "status" | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

const rotas = ref<Rota[]>([]);
const totalItems = ref(0);
const isLoading = ref(false);
const error = ref<string | null>(null);

const rotaService = useRotaService();

const statusFilters = [
  {
    label: "Todas",
    value: "",
    color: "var(--color-text-muted)",
    activeClass: "bg-[var(--color-hover)] text-[var(--color-text)]",
  },
  {
    label: "Pendente",
    value: "pendente",
    color: "var(--color-text-muted)",
    activeClass: "bg-[var(--color-hover)] text-[var(--color-text)]",
  },
  {
    label: "Em Andamento",
    value: "em_andamento",
    color: "var(--color-primary)",
    activeClass:
      "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary-border)]",
  },
  {
    label: "Completa",
    value: "completa",
    color: "var(--color-status-finalizado)",
    activeClass: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  },
];

const statusFilterOptions = computed(() =>
  statusFilters.map((filter) => ({
    label: filter.label,
    value: filter.value,
  })),
);

const filtroStatusSelect = computed({
  get: () => filtroStatus.value,
  set: (value: string) => {
    filtroStatus.value = value;
  },
});

const {
  position: geoPosition,
  getCurrentPosition,
  error: geoError,
  isLoading: isLoadingGeo,
} = useGeolocation({
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000,
});

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage) || 1);

/**
 * Localização do usuário armazenada
 */
const userLocation = computed(() => {
  if (!geoPosition.value) return null;
  return {
    latitude: geoPosition.value.latitude,
    longitude: geoPosition.value.longitude,
    accuracy: geoPosition.value.accuracy,
    timestamp: geoPosition.value.timestamp,
  };
});

/**
 * Stats rápidas de rotas
 */
const rotasCompletas = computed(() => rotas.value.filter((r) => r.status === "completa").length);
const rotasEmAndamento = computed(
  () => rotas.value.filter((r) => r.status === "em_andamento").length,
);

/**
 * Rotas paginadas com ordenação
 */
const rotasPaginadas = computed(() => {
  let rotasOrdenadas = [...rotas.value];

  // Aplicar ordenação se houver
  if (sortField.value) {
    rotasOrdenadas.sort((a, b) => {
      let valueA: number | string;
      let valueB: number | string;

      switch (sortField.value) {
        case "codigo":
          valueA = a.codigo || 0;
          valueB = b.codigo || 0;
          break;
        case "progresso":
          valueA = a.progresso?.percentual_conclusao || 0;
          valueB = b.progresso?.percentual_conclusao || 0;
          break;
        case "status":
          valueA = a.status || "";
          valueB = b.status || "";
          break;
        default:
          return 0;
      }

      if (sortOrder.value === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  return rotasOrdenadas;
});

const filtros = computed<RotaFilters>(() => {
  const filters: RotaFilters = {
    page: currentPage.value,
    itens: itemsPerPage,
  };

  if (filtroDataInicio.value) {
    filters.data_inicio = filtroDataInicio.value.toISOString().split("T")[0];
  }
  if (filtroDataFim.value) {
    filters.data_fim = filtroDataFim.value.toISOString().split("T")[0];
  }
  if (filtroStatus.value) {
    filters.status = filtroStatus.value;
  }

  return filters;
});

/**
 * Carrega rotas do backend
 */
const carregarRotas = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await rotaService.fetchRotas(filtros.value);

    if (response) {
      rotas.value = response.data || [];
      totalItems.value = response.total || response.data?.length || 0;
    } else {
      rotas.value = [];
      totalItems.value = 0;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Erro ao carregar rotas";
    logger.error("[RotasPage] Erro ao carregar rotas:", err);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Recarrega rotas
 */
const recarregarRotas = () => {
  carregarRotas();
};

/**
 * Abre modal de detalhes
 */
const abrirDetalhes = (rota: Rota) => {
  rotaSelecionada.value = rota;
  showDetalhesModal.value = true;
};

/**
 * Ação de adição rápida
 */
const adicionarRapido = (rota: Rota) => {
  logger.info("Adição rápida para rota:", rota.id);
  // TODO: Implementar adição rápida de roteiros
};

/**
 * Handler de filtro de data
 */
const handleDateChange = (value: { start: Date | null; end: Date | null }) => {
  filtroDataInicio.value = value.start;
  filtroDataFim.value = value.end;
  currentPage.value = 1; // Reset para primeira página
};

/**
 * Limpa filtros
 */
const limparFiltros = () => {
  filtroDataInicio.value = null;
  filtroDataFim.value = null;
  filtroStatus.value = null;
  currentPage.value = 1;
};

/**
 * Handler para mudança de status no dropdown
 * Mantém a lógica de toggle: se selecionar o mesmo valor, limpa o filtro
 */
const handleStatusFilterChange = (value: string | number | null | undefined) => {
  const statusValue = value === "" || value === null || value === undefined ? null : String(value);
  // Se selecionar o mesmo valor, limpa o filtro (toggle)
  if (filtroStatus.value === statusValue) {
    filtroStatus.value = null;
  } else {
    filtroStatus.value = statusValue;
  }
  currentPage.value = 1;
};

/**
 * Toggle ordenação
 */
const toggleSort = (field: "codigo" | "progresso" | "status") => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

/**
 * Handler de rota criada
 */
const handleRouteCreated = () => {
  logger.info("Rota criada com sucesso!");
  carregarRotas();
};

/**
 * Formata os filtros ativos para exibição
 */
const formatarFiltrosAtivos = () => {
  const partes: string[] = [];

  if (filtroDataInicio.value) {
    partes.push(`a partir de ${formatarData(filtroDataInicio.value.toISOString())}`);
  }

  if (filtroDataFim.value) {
    partes.push(`até ${formatarData(filtroDataFim.value.toISOString())}`);
  }

  if (filtroStatus.value) {
    const statusFilter = statusFilters.find((f) => f.value === filtroStatus.value);
    if (statusFilter) {
      partes.push(`status: ${statusFilter.label}`);
    }
  }

  return partes.join(" • ");
};

watch(
  [
    () => currentPage.value,
    () => filtroDataInicio.value,
    () => filtroDataFim.value,
    () => filtroStatus.value,
  ],
  () => {
    carregarRotas();
  },
);

/**
 * Solicita permissão de geolocalização
 */
const solicitarLocalizacao = async () => {
  try {
    await getCurrentPosition();
    if (geoPosition.value) {
      logger.info("[RotasPage] Localização do usuário obtida:", {
        lat: geoPosition.value.latitude,
        lng: geoPosition.value.longitude,
        accuracy: geoPosition.value.accuracy,
      });
    }
  } catch (err) {
    logger.warn("[RotasPage] Erro ao obter localização:", err);
  }
};

onMounted(() => {
  carregarRotas();
  solicitarLocalizacao();
});
</script>

<style scoped>
/* Transições de lista */
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
