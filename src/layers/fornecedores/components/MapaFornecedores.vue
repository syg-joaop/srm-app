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

import { fornecedorItemSchema } from "../schemas/fornecedores.schema";

import type { UiMapaPonto, UiMapaStatusConfig } from "~/components/ui/maps.types";

type FornecedorItem = z.infer<typeof fornecedorItemSchema>;

const statusConfig: UiMapaStatusConfig = { ...COMMON_MAP_STATUS_CONFIG };

const props = defineProps<{
  fornecedores?: FornecedorItem[];
}>();

const pontos = computed<UiMapaPonto[]>(() => {
  const fornecedores = props.fornecedores ?? [];

  // Filter fornecedores with valid coordinates
  const validFornecedores = fornecedores.filter(
    (f): f is FornecedorItem & { latitude: string; longitude: string } =>
      f.latlong === true &&
      typeof f.latitude === "string" &&
      typeof f.longitude === "string" &&
      f.latitude !== "" &&
      f.longitude !== ""
  );

  return validFornecedores.map((f) => ({
    id: f.fornecedor ?? "",
    titulo: f.fornecedor ?? "",
    subtitulo: f.fanta,
    status: f.status,
    latitude: f.latitude,
    longitude: f.longitude,
    linhas: [
      { rotulo: "Cidade", valor: f.cidade ?? "" },
      { rotulo: "Última carga", valor: f.ultima_carga ?? "" },
    ],
  }));
});
</script>
