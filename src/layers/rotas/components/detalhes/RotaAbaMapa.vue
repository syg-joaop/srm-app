<template>
  <div
    class="h-[350px] sm:h-[400px] rounded-lg overflow-hidden border border-[var(--color-border)]"
  >
    <MapaRota
      ref="mapaRef"
      :roteiros="roteiros"
      :polyline-encoded="polylineEncoded"
      :summary-data="summaryData"
      :user-location="userLocation"
      @ponto-click="$emit('pontoClick', $event)"
      @loaded="$emit('loaded', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import MapaRota from "../MapaRota.vue";

import type { Roteiro } from "../../schemas/rotas.schema";
import type { VrpSummary } from "../../schemas/rotas.schema";

defineProps<{
  roteiros: Roteiro[];
  polylineEncoded: string | null;
  summaryData: VrpSummary | null;
  userLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null;
}>();

defineEmits<{
  (e: "pontoClick", roteiro: Roteiro): void;
  (e: "loaded", data: { polyline: string | null; summary: VrpSummary | null }): void;
}>();

const mapaRef = ref<InstanceType<typeof MapaRota> | null>(null);

const invalidateSize = () => {
  if (mapaRef.value && typeof mapaRef.value.invalidateSize === "function") {
    mapaRef.value.invalidateSize();
  }
};

const carregarRota = () => {
  if (mapaRef.value && typeof mapaRef.value.carregarRota === "function") {
    mapaRef.value.carregarRota();
  }
};

defineExpose({ invalidateSize, carregarRota });
</script>
