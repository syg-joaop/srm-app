<template>
  <div class="flex flex-col h-full">
    <!-- Header com legenda -->
    <div class="flex justify-between items-center pb-3 border-b border-[var(--color-border-subtle)] mb-3">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-sm bg-[var(--color-primary)]"></span>
        <span class="text-[11px] text-[var(--color-text-muted)]">Mês Atual</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-[var(--color-text-muted)]">Mês Anterior</span>
        <span class="w-2 h-2 rounded-sm bg-[var(--color-text-muted)] opacity-50"></span>
      </div>
    </div>

    <!-- Lista de produtos -->
    <div class="flex flex-col flex-1">
      <div
        v-for="(produto, index) in produtos"
        :key="produto.name"
        class="py-2 border-b border-[var(--color-border-subtle)] last:border-b-0"
      >
        <!-- Header: ranking, nome e valores -->
        <div class="flex items-center justify-between gap-3 mb-1.5">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span
              class="text-xs font-semibold w-4 shrink-0"
              :class="index < 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'"
            >{{ index + 1 }}.</span>
            <span class="text-xs font-medium text-[var(--color-text)] truncate hover:text-[var(--color-primary)] transition-colors cursor-default">{{ produto.name }}</span>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <span class="text-[11px] font-semibold text-[var(--color-primary)] min-w-[60px] text-right">{{ formatValue(produto.current) }}</span>
            <span class="text-[11px] text-[var(--color-text-muted)] min-w-[60px] text-right">{{ formatValue(produto.previous) }}</span>
          </div>
        </div>

        <!-- Barras de progresso -->
        <div class="flex gap-0.5 pl-6">
          <!-- Barra mês atual (esquerda para direita) -->
          <div class="flex-1 h-1 bg-[var(--color-border-subtle)] rounded-l-full overflow-hidden">
            <div
              class="h-full bg-[var(--color-primary)] rounded-l-full transition-all duration-500"
              :style="{ width: getPercentage(produto.current) + '%' }"
            ></div>
          </div>
          <!-- Barra mês anterior (direita para esquerda) -->
          <div class="flex-1 h-1 bg-[var(--color-border-subtle)] rounded-r-full overflow-hidden flex justify-end">
            <div
              class="h-full bg-[var(--color-text-muted)] opacity-50 rounded-r-full transition-all duration-500"
              :style="{ width: getPercentage(produto.previous) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatarKg } from "~/utils/formatters/formatadores";

interface Props {
  data: {
    names: string[];
    current: number[];
    previous: number[];
  };
}

const props = defineProps<Props>();

const produtos = computed(() => {
  if (!props.data?.names?.length) return [];

  return props.data.names.map((name, index) => {
    const current = props.data.current[index] || 0;
    const previous = props.data.previous[index] || 0;

    return { name, current, previous };
  });
});

const maxValue = computed(() => {
  if (!props.data) return 1;
  const allValues = [...(props.data.current || []), ...(props.data.previous || [])];
  return Math.max(...allValues, 1);
});

const getPercentage = (value: number): number => {
  return (value / maxValue.value) * 100;
};

const formatValue = (value: number): string => {
  return formatarKg(value);
};
</script>
