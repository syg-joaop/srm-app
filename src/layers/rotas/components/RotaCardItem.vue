<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)]"
    role="listitem"
    :aria-label="`Rota ${rota.codigo || rota.id}, ${getStatusLabel(rota.status)}`"
  >
    <!-- Barra de status sutil -->
    <div
      class="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200"
      :class="{
        'bg-[var(--color-status-finalizado)]': rota.status === 'completa',
        'bg-[var(--color-primary)]': rota.status === 'em_andamento',
        'bg-[var(--color-border)]': rota.status === 'pendente',
      }"
      aria-hidden="true"
    ></div>

    <div class="px-4 py-3 md:px-4 md:py-3">
      <!-- Layout Mobile -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              class="mt-0.5 p-1.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]"
              aria-hidden="true"
            >
              <RouteIcon class="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                Rota #{{ rota.codigo || rota.id }}
              </span>
              <span class="text-xs font-mono tabular-nums text-[var(--color-text-muted)] mt-0.5">
                {{
                  formatarIntervaloDatas(rota.data_inicio || undefined, rota.data_fim || undefined)
                }}
              </span>
            </div>
          </div>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border shrink-0"
            :class="{
              'bg-[var(--color-success-soft)] border-[var(--color-success-border)] text-[var(--color-success)]':
                rota.status === 'CONCLUIDA',
              'bg-[var(--color-primary-soft)] border-[var(--color-primary-border)] text-[var(--color-primary)]':
                rota.status === 'EM_ANDAMENTO',
              'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]':
                rota.status === 'PENDENTE',
              'bg-[var(--color-warning-soft)] border-[var(--color-warning-border)] text-[var(--color-warning)]':
                rota.status === 'REAGENDADO',
              'bg-[var(--color-danger-soft)] border-[var(--color-danger-border)] text-[var(--color-danger)]':
                rota.status === 'CANCELADA',
            }"
          >
            {{ getStatusLabel(rota.status) }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 flex-1">
            <div
              v-if="rota.progresso"
              class="flex-1 h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)]"
            >
              <div
                class="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                :style="{ width: `${rota.progresso.percentual_conclusao}%` }"
              ></div>
            </div>
            <span v-if="rota.progresso" class="text-xs font-mono tabular-nums text-[var(--color-text)] min-w-[32px]">
              {{ rota.progresso.percentual_conclusao }}%
            </span>
          </div>

          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 ml-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click', rota)"
            :aria-label="`Ver detalhes da rota ${rota.codigo || rota.id}`"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <!-- Descrição -->
        <div class="col-span-5 flex items-start gap-3 flex-1 min-w-0">
          <div
            class="mt-1 p-1.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] transition-colors duration-150"
            aria-hidden="true"
          >
            <RouteIcon class="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <span
              class="font-semibold text-[var(--color-text)] text-sm truncate transition-colors duration-150"
            >
              Rota #{{ rota.codigo || rota.id }}
            </span>
            <span class="text-xs font-mono tabular-nums text-[var(--color-text-muted)] mt-0.5 truncate">
              {{
                formatarIntervaloDatas(rota.data_inicio || undefined, rota.data_fim || undefined)
              }}
            </span>
            <span
              class="sm:inline hidden text-xs text-[var(--color-text-muted)] mt-0.5 truncate"
            >
              {{ rota.usuario }}
            </span>
          </div>
        </div>

        <!-- Progresso -->
        <div class="col-span-2 flex justify-center">
          <div v-if="rota.progresso" class="w-full">
            <div class="flex items-center gap-2">
              <div
                class="flex-1 h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)]"
              >
                <div
                  class="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300 ease-out"
                  :style="{
                    width: `${rota.progresso.percentual_conclusao}%`,
                  }"
                  role="progressbar"
                  :aria-valuenow="rota.progresso.percentual_conclusao"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span class="text-xs font-mono tabular-nums text-[var(--color-text)] min-w-[36px] text-right">
                {{ rota.progresso.percentual_conclusao }}%
              </span>
            </div>
          </div>
          <span v-else class="text-xs text-[var(--color-text-muted)]" aria-label="Sem progresso"
            >-</span
          >
        </div>

        <!-- Status -->
        <div class="col-span-2 flex justify-center">
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs border transition-colors duration-150"
            :class="{
              'bg-[var(--color-success-soft)] border-[var(--color-success-border)] text-[var(--color-success)]':
                rota.status === 'CONCLUIDA',
              'bg-[var(--color-primary-soft)] border-[var(--color-primary-border)] text-[var(--color-primary)]':
                rota.status === 'EM_ANDAMENTO',
              'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]':
                rota.status === 'PENDENTE',
              'bg-[var(--color-warning-soft)] border-[var(--color-warning-border)] text-[var(--color-warning)]':
                rota.status === 'REAGENDADO',
              'bg-[var(--color-danger-soft)] border-[var(--color-danger-border)] text-[var(--color-danger)]':
                rota.status === 'CANCELADA',
            }"
            :aria-label="`Status: ${getStatusLabel(rota.status)}`"
          >
            {{ getStatusLabel(rota.status) }}
          </span>
        </div>

        <!-- Ações -->
        <div class="col-span-3 flex items-center justify-end gap-1.5">
          <!-- Botão adicionar roteiro -->
          <button
            class="group/add inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-primary-soft)] hover:border-[var(--color-primary-border)] transition-all duration-150 opacity-0 group-hover/item:opacity-100"
            @click.stop="$emit('adicaoRapida', rota)"
            :aria-label="`Adicionar roteiro à rota ${rota.codigo || rota.id}`"
            title="Adicionar roteiro"
          >
            <Plus class="w-4 h-4 text-[var(--color-text-muted)] group-hover/add:text-[var(--color-primary)] transition-colors duration-150" />
          </button>

          <!-- Botão ver detalhes -->
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
            @click.stop="$emit('click', rota)"
            :aria-label="`Ver detalhes da rota ${rota.codigo || rota.id}`"
            title="Ver detalhes"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-150 group-hover/details:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronRight, Plus, Route as RouteIcon } from "lucide-vue-next";

import { getStatusLabel } from "~/components/ui/utils/status";
import { formatarIntervaloDatas } from "~/utils/formatters/date";

import type { Rota } from "../schemas/rotas.schema";

const props = defineProps<{
  rota: Rota;
}>();

const emit = defineEmits<{
  (e: "click", rota: Rota): void;
  (e: "adicaoRapida", rota: Rota): void;
}>();
</script>

