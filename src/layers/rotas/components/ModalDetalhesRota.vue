<template>
  <UiModal v-model="isOpen" size="large" :show-close="true">
    <template #title>
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded flex items-center justify-center"
          style="background-color: var(--color-hover)"
        >
          <div
            class="w-3 h-3 rounded-full"
            :style="{
              backgroundColor: getStatusColor(rota?.status),
              boxShadow: `0 0 6px ${getStatusColor(rota?.status)}`,
            }"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h2
              class="text-lg font-bold tracking-tight truncate font-mono tabular-nums"
              style="color: var(--color-text); letter-spacing: -0.02em"
            >
              Rota #{{ rota?.codigo || rota?.id }}
            </h2>
            <UiBadge :variant="getStatusVariant(rota?.status)" size="small">
              {{ getStatusLabel(rota?.status) }}
            </UiBadge>
          </div>
          <div
            class="flex items-center gap-2 text-xs mt-1 flex-wrap"
            style="color: var(--color-text-muted)"
          >
            <span class="flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              {{
                formatarIntervaloDatas(rota?.data_inicio || undefined, rota?.data_fim || undefined)
              }}
            </span>
            <span class="w-1 h-1 rounded-full" style="background-color: var(--color-border)" />
            <span class="flex items-center gap-1.5">
              <User class="w-3.5 h-3.5" />
              {{ rota?.usuario }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Progresso -->
      <UiCard v-if="rota?.progresso" :no-padding="false">
        <div class="flex items-center justify-between mb-4">
          <span
            class="text-[11px] font-semibold uppercase tracking-wide"
            style="color: var(--color-text-muted)"
          >
            Progresso da Rota
          </span>
          <span
            class="text-2xl font-bold font-mono tabular-nums"
            style="color: var(--color-primary)"
          >
            {{ rota.progresso.percentual_conclusao }}%
          </span>
        </div>

        <div class="h-2 rounded overflow-hidden mb-4" style="background-color: var(--color-border)">
          <div
            class="h-full transition-all duration-200"
            style="background-color: var(--color-primary)"
            :style="{ width: `${rota.progresso.percentual_conclusao}%` }"
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center gap-1">
            <div
              class="text-2xl font-bold font-mono tabular-nums"
              style="color: var(--color-success)"
            >
              {{ rota.progresso.concluidos }}
            </div>
            <div
              class="text-[11px] uppercase tracking-wide font-medium"
              style="color: var(--color-text-muted)"
            >
              Concluídos
            </div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="text-2xl font-bold font-mono tabular-nums" style="color: var(--color-text)">
              {{ rota.progresso.pendentes }}
            </div>
            <div
              class="text-[11px] uppercase tracking-wide font-medium"
              style="color: var(--color-text-muted)"
            >
              Pendentes
            </div>
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="text-2xl font-bold font-mono tabular-nums" style="color: var(--color-text)">
              {{ rota.progresso.em_andamento }}
            </div>
            <div
              class="text-[11px] uppercase tracking-wide font-medium"
              style="color: var(--color-text-muted)"
            >
              Em Andamento
            </div>
          </div>
        </div>
      </UiCard>

      <!-- Tabs -->
      <UiSegmentedControl
        v-model="abaAtiva"
        :options="tabOptions"
        :full-width="true"
        size="sm"
        :hide-labels-on-mobile="false"
      />

      <!-- Conteúdo das abas -->
      <div class="min-h-[300px]">
        <!-- ABA MAPA -->
        <RotaAbaMapa
          v-if="abaAtiva === 'mapa'"
          ref="mapaRef"
          :roteiros="roteiros"
          :polyline-encoded="polyline"
          :summary-data="summary"
          :user-location="userLocation"
          @loaded="handleMapLoaded"
        />

        <!-- ABA ROTEIROS -->
        <RotaAbaRoteiros
          v-else-if="abaAtiva === 'roteiros'"
          :roteiros="roteirosOrdenados"
          :has-changes="hasChanges"
          :is-saving="isSaving"
          @save="salvarOrdem"
          @adicionar="showAdicionarModal = true"
          @remover="handleRemoveRoteiro"
          @reordenar="reorderItems"
        />

        <!-- ABA DADOS -->
        <RotaAbaDados v-else :rota="rota" :summary="summary" :roteiros-count="roteiros.length" />
      </div>
    </div>

    <template #footer>
      <UiButton variant="secondary" @click="isOpen = false">Fechar</UiButton>
    </template>
  </UiModal>

  <!-- Modal de adicionar roteiro -->
  <ModalAdicionarRoteiro
    v-model="showAdicionarModal"
    :rota="rota"
    :current-sequence="maxSequencia"
    @added="handleRoteiroAdded"
  />
</template>

<script setup lang="ts">
import { Calendar, Info, List, Map as MapIcon, User } from "lucide-vue-next";

import { getStatusColor, getStatusLabel, getStatusVariant } from "~/components/ui/utils/status";
import { formatarIntervaloDatas } from "~/utils/formatters/date";
import { logger } from "~/utils/logger";

import RotaAbaDados from "./detalhes/RotaAbaDados.vue";
import RotaAbaMapa from "./detalhes/RotaAbaMapa.vue";
import RotaAbaRoteiros from "./detalhes/RotaAbaRoteiros.vue";
import ModalAdicionarRoteiro from "./ModalAdicionarRoteiro.vue";

import type { Rota, Roteiro, VrpSummary } from "../schemas/rotas.schema";

const props = defineProps<{
  modelValue: boolean;
  rota: Rota | null;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Tabs config
const tabOptions = [
  { label: "Mapa", value: "mapa", icon: MapIcon },
  { label: "Roteiros", value: "roteiros", icon: List },
  { label: "Dados", value: "dados", icon: Info },
];

// Estado local
const abaAtiva = ref("mapa");
const roteiros = ref<Roteiro[]>([]);
const polyline = ref<string | null>(null);
const summary = ref<VrpSummary | null>(null);
const isLoadingRoteiros = ref(false);
const mapaRef = ref<InstanceType<typeof RotaAbaMapa> | null>(null);
const showAdicionarModal = ref(false);

const hasChanges = ref(false);
const isSaving = ref(false);
const originalOrder = ref<number[]>([]);

// Service
const rotaService = useRotaService();

// Computed para sequência máxima
const maxSequencia = computed(() => {
  if (roteiros.value.length === 0) return 0;
  return Math.max(...roteiros.value.map((r) => r.sequencia || 0));
});

/**
 * Função auxiliar para invalidar o tamanho do mapa com verificações
 */
const invalidateMapSize = () => {
  if (mapaRef.value && typeof mapaRef.value.invalidateSize === "function") {
    mapaRef.value.invalidateSize();
  }
};

// Roteiros ordenados por sequência
const roteirosOrdenados = computed(() =>
  [...roteiros.value].sort((a, b) => (a.sequencia || 0) - (b.sequencia || 0)),
);

/**
 * Carrega roteiros quando a rota muda
 */
const carregarDados = async () => {
  if (!props.rota?.id) return;

  isLoadingRoteiros.value = true;

  try {
    const response = await rotaService.fetchRoteiros(props.rota.id, {
      itens: 100,
    });
    roteiros.value = response?.data || [];
    polyline.value = null;
    summary.value = null;
    hasChanges.value = false;
    originalOrder.value = roteiros.value.map((r) => r.id);
  } catch (error) {
    logger.error("[ModalDetalhesRota] Erro ao carregar dados:", error);
  } finally {
    isLoadingRoteiros.value = false;
  }
};

const handleMapLoaded = (data: { polyline: string | null; summary: VrpSummary | null }) => {
  polyline.value = data.polyline;
  summary.value = data.summary;
};

// === REORDER LOGIC ===

const reorderItems = (fromIndex: number, toIndex: number) => {
  const items = [...roteirosOrdenados.value];
  const [movedItem] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, movedItem);

  items.forEach((item, index) => {
    item.sequencia = index + 1;
  });

  roteiros.value = items;

  const currentOrder = items.map((r) => r.id);
  hasChanges.value = JSON.stringify(currentOrder) !== JSON.stringify(originalOrder.value);
};

const salvarOrdem = async () => {
  if (!props.rota?.id) return;

  isSaving.value = true;

  try {
    const roteirosParaSalvar = roteirosOrdenados.value.map((r, index) => ({
      id: r.id,
      sequencia: index + 1,
    }));

    const success = await rotaService.reordenarRoteiros(roteirosParaSalvar);

    if (success) {
      originalOrder.value = roteirosOrdenados.value.map((r) => r.id);
      hasChanges.value = false;

      await nextTick();
      invalidateMapSize();
    }
  } catch (error) {
    logger.error("[ModalDetalhesRota] Erro ao salvar ordem:", error);
  } finally {
    isSaving.value = false;
  }
};

// Watch para quando o modal abre
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal && props.rota) {
      abaAtiva.value = "mapa";
      await carregarDados();

      await nextTick();
      setTimeout(() => {
        invalidateMapSize();
      }, 100);
    }
  },
);

// Watch para mudança de rota
watch(
  () => props.rota?.id,
  () => {
    if (props.modelValue && props.rota) {
      carregarDados();
    }
  },
);

/**
 * Handler quando roteiro é adicionado
 */
const handleRoteiroAdded = async () => {
  await carregarDados();

  await nextTick();
  invalidateMapSize();
};

/**
 * Handler para remover roteiro
 */
const handleRemoveRoteiro = async (roteiro: Roteiro) => {
  if (!props.rota || !confirm(`Deseja remover "${roteiro.nome || "este ponto"}" do roteiro?`))
    return;

  const success = await rotaService.deleteRoteiro(roteiro.id);
  if (success) {
    await carregarDados();

    await nextTick();
    invalidateMapSize();
  }
};
</script>
