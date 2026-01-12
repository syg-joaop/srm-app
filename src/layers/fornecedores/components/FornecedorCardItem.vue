<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)] cursor-pointer"
    role="listitem"
    :aria-label="`Fornecedor ${fornecedor.fornecedor}, ${fornecedor.status || 'sem status'}`"
    @click="$emit('click', fornecedor)"
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
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              class="mt-0.5 p-1.5 rounded-md transition-colors duration-200"
              :class="iconClass"
              aria-hidden="true"
            >
              <Building2 class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                {{ fornecedor.fornecedor }}
              </span>
              <span class="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {{ fornecedor.fanta }}
              </span>
            </div>
          </div>
          <span class="text-[11px] text-[var(--color-text-muted)] whitespace-nowrap flex-shrink-0">
            {{ fornecedor.cidade }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <UiBadge
            v-if="fornecedor.status"
            :variant="statusVariant"
            :dot="true"
            size="small"
          >
            {{ fornecedor.status }}
          </UiBadge>
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 ml-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click', fornecedor)"
            :aria-label="`Ver detalhes de ${fornecedor.fornecedor}`"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <!-- Fornecedor -->
        <div class="col-span-4 flex items-center gap-3">
          <div
            class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200"
            :class="iconClass"
          >
            <Building2 class="w-4 h-4" />
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate"
            >
              {{ fornecedor.fornecedor }}
            </span>
            <span class="text-xs text-[var(--color-text-muted)] truncate">
              {{ fornecedor.fanta }}
            </span>
          </div>
        </div>

        <!-- Cidade -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ fornecedor.cidade }}
          </span>
        </div>

        <!-- Última carga -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm font-mono tabular-nums text-[var(--color-text-muted)]">
            {{ fornecedor.ultima_carga || "-" }}
          </span>
        </div>

        <!-- Status -->
        <div class="col-span-2 flex justify-center">
          <UiBadge
            v-if="fornecedor.status"
            :variant="statusVariant"
            :dot="true"
            size="small"
          >
            {{ fornecedor.status }}
          </UiBadge>
        </div>

        <!-- Ações -->
        <div class="col-span-2 flex items-center justify-end gap-1.5">
          <button
            class="group/add inline-flex items-center gap-1.5 px-2.5 h-8 rounded-md bg-[var(--color-primary)] text-white text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-all duration-150 opacity-0 group-hover/item:opacity-100 active:scale-95"
            @click.stop="$emit('add-route', fornecedor)"
            :aria-label="`Adicionar ${fornecedor.fornecedor} à rota`"
            title="Adicionar à rota"
          >
            <MapPin class="w-3 h-3" />
            <span class="hidden lg:inline">Rota</span>
          </button>

          <button
            class="group/msg inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 opacity-0 group-hover/item:opacity-100"
            @click.stop
            :aria-label="`Enviar mensagem para ${fornecedor.fornecedor}`"
            title="Enviar mensagem"
          >
            <MessageSquareText class="w-4 h-4 text-[var(--color-text-muted)] group-hover/msg:text-[var(--color-primary)] transition-colors duration-150" />
          </button>

          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
            @click.stop="$emit('click', fornecedor)"
            :aria-label="`Ver detalhes de ${fornecedor.fornecedor}`"
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
import { Building2, ChevronRight, MapPin, MessageSquareText } from "lucide-vue-next";
import { z } from "zod";

import { type Variant } from "~/components/ui/UiBadge.vue";
import {
  COMMON_STATUS_ICON_CLASSES,
  COMMON_STATUS_VARIANTS,
  resolveStatusIconClass,
  resolveStatusVariant,
} from "~/components/ui/utils/status";

import { fornecedorItemSchema } from "../schemas/fornecedores.schema";

type Fornecedor = z.infer<typeof fornecedorItemSchema>;

const props = defineProps<{
  fornecedor: Fornecedor;
}>();

defineEmits<{
  (e: "click", fornecedor: Fornecedor): void;
  (e: "add-route", fornecedor: Fornecedor): void;
}>();

const statusVariant = computed<Variant>(() =>
  resolveStatusVariant(props.fornecedor.status, COMMON_STATUS_VARIANTS) as Variant,
);

const iconClass = computed(() =>
  resolveStatusIconClass(props.fornecedor.status, COMMON_STATUS_ICON_CLASSES),
);

const statusBarClass = computed(() => {
  const status = props.fornecedor.status?.toLowerCase();
  if (status === "ativo") return "bg-[var(--color-success)]";
  if (status === "inativo") return "bg-[var(--color-danger)]";
  return "bg-[var(--color-border)]";
});
</script>
