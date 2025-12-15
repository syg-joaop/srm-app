<template>
  <div
    class="h-[600px] w-full rounded-xl overflow-hidden border"
    style="border-color: var(--color-border)"
  >
    <UiMapaPontos :pontos="pontos" :status-config="statusConfig" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiMapaPontos from "~/components/ui/UiMapaPontos.vue";
import type { UiMapaPonto, UiMapaStatusConfig } from "~/components/ui/maps.types";
import type { ProspectoMapItem } from "../prospecto.types";

const statusConfig: UiMapaStatusConfig = {
  ativo: { color: "#10b981", label: "Ativo" },
  alerta: { color: "#f59e0b", label: "Alerta" },
  inativo: { color: "#ef4444", label: "Inativo" },
  novo: { color: "#3b82f6", label: "Novo" },
};

const props = defineProps<{
  prospectos?: ProspectoMapItem[];
}>();

const pontos = computed<UiMapaPonto[]>(() => {
  const prospectos = props.prospectos ?? [];

  return prospectos
    .filter((p) => p.latlong)
    .map((p) => ({
      id: p.prospecto,
      titulo: p.prospecto,
      subtitulo: p.fanta,
      status: p.status,
      latitude: p.latitude,
      longitude: p.longitude,
      linhas: [
        { rotulo: "Cidade", valor: p.cidade },
        { rotulo: "Última interação", valor: p.ultima_interacao },
      ],
    }));
});
</script>
