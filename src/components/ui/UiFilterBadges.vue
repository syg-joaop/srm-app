<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div v-if="hasActiveFilters" class="flex items-center gap-2 mb-6 flex-wrap">
      <span class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
        Filtros ativos
      </span>
      <div class="flex items-center gap-2 flex-wrap">
        <span
          v-for="(filter, index) in activeFilters"
          :key="index"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all duration-150"
          :class="filter.variant === 'primary'
            ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary-border)] text-[var(--color-primary)] font-medium'
            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] font-mono'
          "
        >
          <span v-if="filter.label" class="text-[var(--color-text-muted)]">{{ filter.label }}:</span>
          {{ filter.value }}
          <button
            v-if="filter.removable !== false"
            class="ml-0.5 p-0.5 rounded hover:bg-[var(--color-hover)] transition-colors"
            @click="$emit('remove', filter.key)"
            :aria-label="`Remover filtro ${filter.label || filter.value}`"
          >
            <X class="w-3 h-3" />
          </button>
        </span>
      </div>

      <button
        v-if="showClearAll && activeFilters.length > 1"
        class="text-xs font-medium text-[var(--color-danger)] hover:text-[var(--color-danger-dark)] transition-colors flex items-center gap-1 ml-2"
        @click="$emit('clear-all')"
      >
        <X class="w-3.5 h-3.5" />
        Limpar todos
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";

export interface FilterBadge {
  key: string;
  label?: string;
  value: string;
  variant?: "default" | "primary";
  removable?: boolean;
}

interface Props {
  filters: FilterBadge[];
  showClearAll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showClearAll: true,
});

defineEmits<{
  (e: "remove", key: string): void;
  (e: "clear-all"): void;
}>();

const activeFilters = computed(() => props.filters.filter((f) => f.value));
const hasActiveFilters = computed(() => activeFilters.value.length > 0);

defineOptions({ name: "UiFilterBadges" });
</script>
