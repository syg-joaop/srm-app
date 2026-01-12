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
          aria-label="Criar nova rota"
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
          aria-label="Filtrar rotas por período"
          @change="(value) => handleDateChange(value as { start: Date | null; end: Date | null })"
        />

        <UiButton
          v-if="filtroDataInicio || filtroDataFim"
          variant="ghost"
          size="small"
          @click="limparFiltros"
          aria-label="Limpar filtros de data"
        >
          <X class="w-4 h-4" />
          Limpar
        </UiButton>
      </div>

      <!-- Indicador de localização do usuário -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="userLocation"
          class="flex items-center gap-2 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 w-fit"
        >
          <Icon icon="heroicons:map-pin-20-solid" class="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span class="text-[var(--color-text-muted)]">
            Localização obtida
            <span class="font-medium font-mono tabular-nums text-[var(--color-text)] ml-1">
              (±{{ Math.round(userLocation.accuracy) }}m)
            </span>
          </span>
        </div>
      </Transition>

      <!-- Erro de geolocalização -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="geoError && !userLocation"
          class="flex items-center justify-between gap-3 text-xs bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <Icon icon="heroicons:exclamation-triangle" class="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span class="text-orange-800 dark:text-orange-200">
              Localização não disponível. Rotas serão otimizadas sem ponto de partida.
            </span>
          </div>
          <button
            class="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
            @click="solicitarLocalizacao"
          >
            Tentar novamente
          </button>
        </div>
      </Transition>

      <!-- Indicador de filtros ativos -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="filtroDataInicio || filtroDataFim"
          class="flex items-center gap-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded px-3 py-2 w-fit"
        >
          <Icon icon="heroicons:funnel" class="w-3.5 h-3.5" />
          <span>
            Filtros ativos:
            <span class="font-medium text-[var(--color-text)]">
              {{ formatarFiltrosAtivos() }}
            </span>
          </span>
        </div>
      </Transition>
    </div>

    <!-- Loading state com skeleton -->
    <div v-if="isLoading" class="flex flex-col gap-1.5 md:gap-0" aria-hidden="true">
      <!-- Header da tabela skeleton -->
      <div
        class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-background)] rounded-t-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider opacity-50"
      >
        <div class="col-span-5">Descrição</div>
        <div class="col-span-2 text-center">Progresso</div>
        <div class="col-span-2 text-center">Status</div>
        <div class="col-span-3 text-end">Ações</div>
      </div>

      <!-- Skeleton cards -->
      <RotaCardSkeleton v-for="i in 5" :key="`skeleton-${i}`" />
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
          <Icon icon="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500" />
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
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="!isLoading && !error">
        <div
          v-if="rotas.length > 0"
          class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-background)] rounded-t-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
          role="row"
        >
          <div class="col-span-5" role="columnheader">Descrição</div>
          <div class="col-span-2 text-center" role="columnheader">Progresso</div>
          <div class="col-span-2 text-center" role="columnheader">Status</div>
          <div class="col-span-3 text-end" role="columnheader">Ações</div>
        </div>

        <div class="flex flex-col gap-1.5 md:gap-0" role="list">
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

        <UiEmptyState
          v-if="rotas.length === 0"
          title="Nenhuma rota encontrada"
          :description="
            filtroDataInicio || filtroDataFim
              ? 'Tente ajustar os filtros de data para ver mais resultados.'
              : 'Crie sua primeira rota para começar a organizar seus fornecedores.'
          "
          role="status"
          aria-live="polite"
        >
          <template #icon>
            <RouteIcon class="w-12 h-12" />
          </template>
          <template #action>
            <UiButton
              v-if="!filtroDataInicio && !filtroDataFim"
              variant="primary"
              @click="showNovaRotaModal = true"
            >
              <Plus class="w-4 h-4" />
              Nova Rota
            </UiButton>
            <UiButton v-else variant="secondary" @click="limparFiltros">
              <X class="w-4 h-4" />
              Limpar filtros
            </UiButton>
          </template>
        </UiEmptyState>
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
import { Icon, Plus, Route as RouteIcon, X } from "lucide-vue-next";

import { formatarData } from "~/utils/formatters/date";
import { logger } from "~/utils/logger";

import ModalDetalhesRota from "../components/ModalDetalhesRota.vue";
import ModalNovaRota from "../components/ModalNovaRota.vue";
import RotaCardItem from "../components/RotaCardItem.vue";
import RotaCardSkeleton from "../components/RotaCardSkeleton.vue";

import type { Rota, RotaFilters } from "../schemas/rotas.schema";

definePageMeta({
  layout: "default",
});

// Estado
const showNovaRotaModal = ref(false);
const showDetalhesModal = ref(false);
const rotaSelecionada = ref<Rota | null>(null);
const filtroDataInicio = ref<Date | null>(null);
const filtroDataFim = ref<Date | null>(null);
const currentPage = ref(1);
const itemsPerPage = 10;

// Dados
const rotas = ref<Rota[]>([]);
const totalItems = ref(0);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Service
const rotaService = useRotaService();

// Geolocalização do usuário
const {
  position: geoPosition,
  getCurrentPosition,
  error: geoError,
  isLoading: isLoadingGeo,
} = useGeolocation({
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 300000, // Cache por 5 minutos
});

// Computed
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

const rotasPaginadas = computed(() => {
  // Se os dados já vêm paginados do backend, retorna direto
  return rotas.value;
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
  currentPage.value = 1;
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

  return partes.join(" ");
};

// Watch para recarregar quando filtros mudam
watch([() => currentPage.value, () => filtroDataInicio.value, () => filtroDataFim.value], () => {
  carregarRotas();
});

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

// Carrega dados iniciais e solicita localização
onMounted(() => {
  carregarRotas();
  solicitarLocalizacao();
});
</script>

<style scoped>
/* Transições para lista de itens */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Move transition para reordenação */
.list-move {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
