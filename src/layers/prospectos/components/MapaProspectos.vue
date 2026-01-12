<template>
  <div
    class="h-[600px] w-full rounded-xl overflow-hidden border"
    style="border-color: var(--color-border)"
  >
    <UiMapaPontos :pontos="pontos" :status-config="statusConfig" />
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

import { COMMON_MAP_STATUS_CONFIG } from "~/components/ui/utils/status";

import type { UiMapaPonto, UiMapaStatusConfig } from "~/components/ui/maps.types";
import { prospectoMapItemSchema } from "../schemas/prospectos.schema";

type ProspectoMapItem = z.infer<typeof prospectoMapItemSchema>;

const statusConfig: UiMapaStatusConfig = {
  ...COMMON_MAP_STATUS_CONFIG,
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
      id: p.fornecedor || "",
      titulo: p.fornecedor || "",
      subtitulo: p.fanta,
      status: p.status,
      latitude: p.latitude || "",
      longitude: p.longitude || "",
      linhas: [
        { rotulo: "Nome", valor: p.fornecedor || "" },
        { rotulo: "Cidade", valor: p.cidade || "" },
        { rotulo: "Última carga", valor: p.ultima_carga || "Nenhuma" },
      ],
    }));
});
</script>
