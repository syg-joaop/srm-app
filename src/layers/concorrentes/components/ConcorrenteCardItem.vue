<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)] cursor-pointer"
    role="listitem"
    :aria-label="`Concorrente ${concorrente.nome}`"
    @click="$emit('click', concorrente)"
  >
    <!-- Barra de status sutil -->
    <div
      class="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-warning)] transition-all duration-200"
      aria-hidden="true"
    />

    <div class="px-4 py-3">
      <!-- Layout Mobile -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              class="mt-0.5 p-1.5 rounded-md bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
              aria-hidden="true"
            >
              <Users class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                {{ concorrente.nome }}
              </span>
              <span class="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {{ concorrente.cidade }}{{ concorrente.estado ? ` - ${concorrente.estado}` : "" }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pl-[42px]">
          <span class="text-[11px] text-[var(--color-text-muted)]">
            {{ concorrente.segmento || "Sem segmento" }}
          </span>
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click', concorrente)"
            :aria-label="`Ver detalhes de ${concorrente.nome}`"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <!-- Nome -->
        <div class="col-span-4 flex items-center gap-3">
          <div
            class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[var(--color-warning-soft)] text-[var(--color-warning)] group-hover/item:scale-105 transition-transform duration-200"
          >
            <Users class="w-4 h-4" />
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate"
            >
              {{ concorrente.nome }}
            </span>
          </div>
        </div>

        <!-- Cidade -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ concorrente.cidade }}{{ concorrente.estado ? ` - ${concorrente.estado}` : "" }}
          </span>
        </div>

        <!-- Segmento -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ concorrente.segmento || "-" }}
          </span>
        </div>

        <!-- Telefone -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm font-mono tabular-nums text-[var(--color-text-muted)]">
            {{ concorrente.telefone || "-" }}
          </span>
        </div>

        <!-- Ações -->
        <div class="col-span-2 flex items-center justify-end">
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
            @click.stop="$emit('click', concorrente)"
            :aria-label="`Ver detalhes de ${concorrente.nome}`"
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
import { ChevronRight, Users } from "lucide-vue-next";

import type { Concorrente } from "../schemas/concorrentes.schema";

defineProps<{
  concorrente: Concorrente;
}>();

defineEmits<{
  (e: "click", concorrente: Concorrente): void;
}>();
</script>
