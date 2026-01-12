<template>
  <div class="space-y-4">
    <!-- Dados da Rota - Layout Compacto -->
    <UiCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <!-- Código -->
        <div class="flex flex-col gap-1 min-w-0">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Código
          </span>
          <span
            class="text-sm font-mono tabular-nums font-semibold text-[var(--color-text)] truncate"
          >
            {{ rota?.codigo || rota?.id || "-" }}
          </span>
        </div>

        <!-- Tipo -->
        <div class="flex flex-col gap-1 min-w-0">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Tipo
          </span>
          <span class="text-sm font-semibold text-[var(--color-text)] truncate uppercase">
            {{ rota?.tipo || "-" }}
          </span>
        </div>

        <!-- Status -->
        <div class="flex flex-col gap-1 min-w-0">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Status
          </span>
          <span
            class="text-sm font-semibold truncate"
            :style="{ color: getStatusColor(rota?.status) }"
          >
            {{ getStatusLabel(rota?.status) }}
          </span>
        </div>

        <!-- Responsável -->
        <div class="flex flex-col gap-1 min-w-0">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Responsável
          </span>
          <div class="flex items-center gap-1.5 min-w-0">
            <User class="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
            <span class="text-sm font-medium text-[var(--color-text)] truncate">
              {{ rota?.usuario || "-" }}
            </span>
          </div>
        </div>

        <!-- Criado por -->
        <div class="flex flex-col gap-1 min-w-0">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Criado por
          </span>
          <div class="flex items-center gap-1.5 min-w-0">
            <User class="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
            <span class="text-sm font-medium text-[var(--color-text)] truncate">
              {{ rota?.usuario_created || "-" }}
            </span>
          </div>
        </div>

        <!-- Período de Execução -->
        <div class="flex flex-col gap-1 min-w-0 lg:col-span-1">
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Período
          </span>
          <div class="flex items-center gap-1.5 min-w-0">
            <Calendar class="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
            <span class="text-sm font-medium text-[var(--color-text)] truncate">
              {{
                formatarIntervaloDatas(rota?.data_inicio || undefined, rota?.data_fim || undefined)
              }}
            </span>
          </div>
        </div>

        <!-- Observações (se existir) -->
        <div
          v-if="rota?.observacao"
          class="flex flex-col gap-1 min-w-0 sm:col-span-2 lg:col-span-3"
        >
          <span
            class="text-[11px] text-[var(--color-text-muted)] font-medium uppercase tracking-wide"
          >
            Observações
          </span>
          <p class="text-sm leading-relaxed break-words text-[var(--color-text)]">
            {{ rota.observacao }}
          </p>
        </div>
      </div>
    </UiCard>

    <!-- Resumo logístico -->
    <UiCard v-if="summary">
      <template #header>
        <div class="flex items-center gap-2 text-[var(--color-primary)]">
          <TrendingUp class="w-4 h-4" />
          <span class="font-semibold text-sm">Resumo Logístico</span>
        </div>
      </template>
      <div class="grid grid-cols-3 gap-6">
        <div class="flex flex-col items-center gap-1">
          <div class="text-2xl font-bold font-mono tabular-nums text-[var(--color-text)]">
            {{ roteirosCount }}
          </div>
          <div
            class="text-[11px] uppercase tracking-wide font-medium text-[var(--color-text-muted)]"
          >
            Pontos
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="text-2xl font-bold font-mono tabular-nums text-[var(--color-text)]">
            {{ formatarDistancia(summary.distance.meters) }}
          </div>
          <div
            class="text-[11px] uppercase tracking-wide font-medium text-[var(--color-text-muted)]"
          >
            Distância
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="text-2xl font-bold font-mono tabular-nums text-[var(--color-text)]">
            {{ formatarDuracao(summary.time.duration + summary.time.traveling) }}
          </div>
          <div
            class="text-[11px] uppercase tracking-wide font-medium text-[var(--color-text-muted)]"
          >
            Tempo Est.
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { Calendar, TrendingUp, User } from "lucide-vue-next";

import { getStatusColor, getStatusLabel } from "~/components/ui/utils/status";
import { formatarIntervaloDatas } from "~/utils/formatters/date";
import { formatarDistancia, formatarDuracao } from "~/utils/formatters/formatadores";

import type { Rota, VrpSummary } from "../../schemas/rotas.schema";

defineProps<{
  rota: Rota | null;
  summary: VrpSummary | null;
  roteirosCount: number;
}>();
</script>
