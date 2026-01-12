<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)] cursor-pointer"
    role="listitem"
    :aria-label="`Prospecto ${prospecto.fornecedor}, ${prospecto.status || 'sem status'}`"
    @click="$emit('click', prospecto)"
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
              <UserPlus class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                {{ prospecto.fornecedor }}
              </span>
              <span class="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                {{ prospecto.fanta }}
              </span>
            </div>
          </div>
          <span class="text-[11px] text-[var(--color-text-muted)] whitespace-nowrap flex-shrink-0">
            {{ prospecto.cidade }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <UiBadge
            v-if="prospecto.status"
            :variant="statusVariant"
            :dot="true"
            size="small"
          >
            {{ prospecto.status }}
          </UiBadge>
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 ml-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click', prospecto)"
            :aria-label="`Ver detalhes de ${prospecto.fornecedor}`"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Layout Desktop -->
      <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
        <!-- Prospecto -->
        <div class="col-span-4 flex items-center gap-3">
          <div
            class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200"
            :class="iconClass"
          >
            <UserPlus class="w-4 h-4" />
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate"
            >
              {{ prospecto.fornecedor }}
            </span>
            <span class="text-xs text-[var(--color-text-muted)] truncate">
              {{ prospecto.fanta }}
            </span>
          </div>
        </div>

        <!-- Cidade -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ prospecto.cidade }}
          </span>
        </div>

        <!-- Categoria -->
        <div class="col-span-2 flex items-center">
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ prospecto.categoria || "-" }}
          </span>
        </div>

        <!-- Status -->
        <div class="col-span-2 flex justify-center">
          <UiBadge
            v-if="prospecto.status"
            :variant="statusVariant"
            :dot="true"
            size="small"
          >
            {{ prospecto.status }}
          </UiBadge>
        </div>

        <!-- Ações -->
        <div class="col-span-2 flex items-center justify-end gap-1.5">
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
            @click.stop="$emit('click', prospecto)"
            :aria-label="`Ver detalhes de ${prospecto.fornecedor}`"
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
import { ChevronRight, UserPlus } from "lucide-vue-next";
import { z } from "zod";

import { type Variant } from "~/components/ui/UiBadge.vue";
import {
  COMMON_STATUS_ICON_CLASSES,
  COMMON_STATUS_VARIANTS,
  resolveStatusIconClass,
  resolveStatusVariant,
} from "~/components/ui/utils/status";

import { prospectoItemSchema } from "../schemas/prospectos.schema";

type Prospecto = z.infer<typeof prospectoItemSchema>;

const props = defineProps<{
  prospecto: Prospecto;
}>();

defineEmits<{
  (e: "click", prospecto: Prospecto): void;
}>();

const statusVariant = computed<Variant>(() =>
  resolveStatusVariant(props.prospecto.status, COMMON_STATUS_VARIANTS) as Variant,
);

const iconClass = computed(() =>
  resolveStatusIconClass(props.prospecto.status, COMMON_STATUS_ICON_CLASSES),
);

const statusBarClass = computed(() => {
  const status = props.prospecto.status?.toLowerCase();
  if (status === "ativo") return "bg-[var(--color-success)]";
  if (status === "novo") return "bg-[var(--color-primary)]";
  if (status === "inativo") return "bg-[var(--color-danger)]";
  return "bg-[var(--color-border)]";
});
</script>
