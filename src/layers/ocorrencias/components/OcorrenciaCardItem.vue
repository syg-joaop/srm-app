<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)] cursor-pointer"
    role="listitem"
    :aria-label="`Ocorrência de ${ocorrencia.fornecedor}, ${ocorrencia.status || 'sem status'}`"
    @click="$emit('click', ocorrencia)"
  >
    <!-- Barra de status sutil -->
    <div
      class="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200"
      :class="statusBarClass"
      aria-hidden="true"
    />

    <div class="px-4 py-3">
      <!-- Layout Mobile -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              class="mt-0.5 p-1.5 rounded-md transition-colors duration-200"
              :class="iconClass"
              aria-hidden="true"
            >
              <MessageSquare class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                {{ ocorrencia.fornecedor }}
              </span>
              <span class="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {{ ocorrencia.titulo || "Sem descrição" }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 flex-shrink-0">
            <span class="text-[10px] font-mono tabular-nums text-[var(--color-text-muted)]">
              {{ formatarData(ocorrencia.dataCadastro) }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between pl-[42px]">
          <span class="text-[11px] text-[var(--color-text-muted)]">
            {{ ocorrencia.atendente }}
          </span>
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click', ocorrencia)"
            :aria-label="`Ver detalhes da ocorrência`"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <!-- Status Icon -->
        <div class="col-span-1 flex items-center">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200"
            :class="iconClass"
          >
            <MessageSquare class="w-4 h-4" />
          </div>
        </div>

        <!-- Fornecedor -->
        <div class="col-span-3 flex items-center">
          <span
            class="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors truncate"
          >
            {{ ocorrencia.fornecedor }}
          </span>
        </div>

        <!-- Data Cadastro -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm font-mono tabular-nums text-[var(--color-text-muted)]">
            {{ formatarData(ocorrencia.dataCadastro) || "-" }}
          </span>
        </div>

        <!-- Atendente -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ ocorrencia.atendente }}
          </span>
        </div>

        <!-- Título -->
        <div class="col-span-3 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)] truncate">
            {{ ocorrencia.titulo || "Sem descrição" }}
          </span>
        </div>

        <!-- Ações -->
        <div class="col-span-1 flex items-center justify-center">
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
            @click.stop="$emit('click', ocorrencia)"
            :aria-label="`Ver detalhes da ocorrência`"
            title="Ver detalhes"
          >
            <Eye class="w-4 h-4 text-[var(--color-text-muted)] group-hover/details:text-[var(--color-primary)] transition-colors duration-150" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronRight, Eye, MessageSquare } from "lucide-vue-next";
import { z } from "zod";

import {
  COMMON_STATUS_ICON_CLASSES,
  resolveStatusIconClass,
} from "~/components/ui/utils/status";
import { formatarData } from "~/utils/formatters/date";

import { ocorrenciaSchema } from "../schemas/ocorrencias.schema";

type Ocorrencia = z.infer<typeof ocorrenciaSchema>;

const props = defineProps<{
  ocorrencia: Ocorrencia;
}>();

defineEmits<{
  (e: "click", ocorrencia: Ocorrencia): void;
}>();

const iconClass = computed(() =>
  resolveStatusIconClass(props.ocorrencia.status, COMMON_STATUS_ICON_CLASSES),
);

const statusBarClass = computed(() => {
  const status = props.ocorrencia.status?.toLowerCase();
  if (status === "concluida" || status === "fechada") return "bg-[var(--color-success)]";
  if (status === "acompanhamento" || status === "em_andamento") return "bg-[var(--color-primary)]";
  if (status === "pendente" || status === "aberta") return "bg-[var(--color-warning)]";
  return "bg-[var(--color-border)]";
});
</script>
