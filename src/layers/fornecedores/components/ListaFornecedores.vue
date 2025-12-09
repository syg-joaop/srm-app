<template>
  <div class="space-y-2">
    <div
      class="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-wider opacity-70"
      style="color: var(--color-text-muted)"
    >
      <div class="col-span-1"></div>
      <div class="col-span-3">Fornecedor</div>
      <div class="col-span-3">Fantasia</div>
      <div class="col-span-2">Cidade</div>
      <div class="col-span-2">Última carga</div>
      <div class="col-span-1 text-right">Ações</div>
    </div>

    <div
      v-for="fornecedor in fornecedores"
      :key="fornecedor.codfor"
      class="group/item relative flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-3 p-3 rounded-lg border border-transparent hover:border-primary/30 dark:hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 ease-out hover:shadow-sm cursor-pointer"
      style="background-color: var(--color-surface)"
      @click="$emit('select', fornecedor)"
    >
      <div
        class="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-r-full opacity-0 group-hover/item:h-6 group-hover/item:opacity-100 transition-all duration-300"
        :class="isInactive(fornecedor.status) ? 'bg-red-500' : 'bg-primary'"
      ></div>

      <div class="flex items-center justify-between md:hidden">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            :class="
              isInactive(fornecedor.status) ? 'text-red-500' : 'text-green-500'
            "
            :style="{
              backgroundColor: isInactive(fornecedor.status)
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(74, 222, 128, 0.15)',
            }"
          >
            <Building2 class="w-4 h-4" />
          </div>
          <div class="leading-tight">
            <div class="font-semibold text-sm" style="color: var(--color-text)">
              {{ fornecedor.fornecedor }}
            </div>
            <div
              class="text-xs opacity-80"
              style="color: var(--color-text-muted)"
            >
              {{ fornecedor.fanta }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="fornecedor.status"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border"
            :style="getStatusStyle(fornecedor.status)"
          >
            {{ fornecedor.status }}
          </span>
          <button
            class="p-1.5 -mr-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            style="color: var(--color-text-muted)"
            @click.stop
          >
            <MessageSquareText class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="hidden md:flex col-span-1 items-center justify-start">
        <div
          class="w-8 h-8 rounded-md flex items-center justify-center transition-colors group-hover/item:bg-opacity-25"
          :class="
            isInactive(fornecedor.status) ? 'text-red-500' : 'text-green-500'
          "
          :style="{
            backgroundColor: isInactive(fornecedor.status)
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(74, 222, 128, 0.15)',
            color: isInactive(fornecedor.status) ? '#ef4444' : '#10b981',
          }"
        >
          <Building2 class="w-4 h-4" />
        </div>
      </div>

      <div class="hidden md:flex col-span-3 items-center">
        <span
          class="font-semibold text-sm leading-tight transition-colors group-hover/item:text-primary"
          style="color: var(--color-text)"
        >
          {{ fornecedor.fornecedor }}
        </span>
      </div>

      <div
        class="hidden md:flex col-span-3 items-center text-xs font-medium"
        style="color: var(--color-text-muted)"
      >
        {{ fornecedor.fanta }}
      </div>

      <div class="flex md:hidden flex-row items-center justify-between gap-3">
        <div class="flex flex-col">
          <span
            class="text-[10px] uppercase tracking-wider mb-0.5 opacity-70"
            style="color: var(--color-text-muted)"
            >Cidade</span
          >
          <span
            class="text-xs font-medium"
            style="color: var(--color-text-muted)"
            >{{ fornecedor.cidade }}</span
          >
        </div>
        <div class="flex flex-col text-right items-end">
          <span
            class="text-[10px] uppercase tracking-wider mb-0.5 opacity-70"
            style="color: var(--color-text-muted)"
            >Última Carga</span
          >
          <span
            class="text-xs"
            style="color: var(--color-text-muted)"
            >{{ fornecedor.ultima_carga }}</span
          >
        </div>
      </div>

      <div class="hidden md:flex col-span-2 items-center">
        <span
          class="text-sm font-medium"
          style="color: var(--color-text-muted)"
          >{{ fornecedor.cidade }}</span
        >
      </div>

      <div class="hidden md:flex col-span-2 items-center">
        <span
          class="text-sm"
          style="color: var(--color-text-muted)"
          >{{ fornecedor.ultima_carga }}</span
        >
      </div>

      <div class="hidden md:flex col-span-1 items-center justify-end gap-2">
        <span
          v-if="fornecedor.status"
          class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border hidden lg:inline-block"
          :style="getStatusStyle(fornecedor.status)"
        >
          {{ fornecedor.status }}
        </span>
        <div
          v-if="fornecedor.status === 'alerta'"
          class="lg:hidden w-2 h-2 rounded-full animate-pulse"
          style="background-color: var(--color-status-vencido)"
          title="Alerta"
        ></div>

        <button
          class="p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-primary"
          style="color: var(--color-text-muted)"
          @click.stop
        >
          <MessageSquareText class="w-4 h-4" />
        </button>
      </div>

      <div
        class="md:hidden pt-2 mt-1 border-t border-dashed"
        style="border-color: var(--color-border)"
      >
        <button
          class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:bg-opacity-10 active:scale-[0.98]"
          style="
            background-color: var(--color-surface);
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
          "
          @click.stop
        >
          <MapPin class="w-3.5 h-3.5" />
          <span>Adicionar à rota</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building2,
  MessageSquareText,
  AlertCircle,
  MapPin,
} from "lucide-vue-next";
import type { Fornecedor } from "../types/fornecedores";

defineProps<{
  fornecedores: Fornecedor[];
}>();

defineEmits<{
  (e: "select", fornecedor: Fornecedor): void;
}>();

const isInactive = (status: string) => {
  return (status || "").toLowerCase().trim() === "inativo";
};

const getStatusStyle = (status: string) => {
  const normalized = status ? status.toLowerCase().trim() : "";

  switch (normalized) {
    case "ativo":
      return {
        backgroundColor: "rgba(74, 222, 128, 0.1)",
        color: "var(--color-status-finalizado)",
        borderColor: "rgba(74, 222, 128, 0.2)",
      };
    case "alerta":
      return {
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        color: "var(--color-status-acompanhamento)",
        borderColor: "rgba(251, 191, 36, 0.2)",
      };
    case "inativo":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "var(--color-status-vencido)",
        borderColor: "rgba(239, 68, 68, 0.2)",
      };
    default:
      return {
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        color: "var(--color-text-muted)",
        borderColor: "var(--color-border)",
      };
  }
};
</script>
