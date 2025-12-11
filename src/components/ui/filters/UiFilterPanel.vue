<template>
  <div>
    <!-- Botão de Toggle -->
    <button
      class="p-2.5 rounded-lg border transition-colors relative"
      :style="[
        isOpen
          ? {
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              color: '#fff',
            }
          : {
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            },
      ]"
      @click="isOpen = !isOpen"
    >
      <Filter class="w-5 h-5" />
      <span
        v-if="activeFiltersCount > 0"
        class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full"
        style="background-color: var(--color-danger); color: #fff"
      >
        {{ activeFiltersCount }}
      </span>
    </button>

    <!-- Painel de Filtros -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="mt-4 p-3 sm:p-4 rounded-lg border"
        style="border-color: var(--color-border); background-color: var(--color-surface)"
      >
        <!-- Filtros tipo Select -->
        <div
          v-if="selectFilters.length > 0"
          class="grid gap-3 sm:gap-4 mb-4"
          :class="gridColsClass"
        >
          <UiSelect
            v-for="filter in selectFilters"
            :key="filter.key"
            :model-value="modelValue[filter.key]"
            :label="filter.label"
            :options="filter.options"
            :placeholder="filter.placeholder"
            @update:model-value="updateFilter(filter.key, $event)"
          />
        </div>

        <!-- Filtros tipo Input -->
        <div
          v-if="inputFilters.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4"
        >
          <div v-for="filter in inputFilters" :key="filter.key">
            <label
              v-if="filter.label"
              class="block text-xs font-medium mb-1.5"
              style="color: var(--color-text-muted)"
            >
              {{ filter.label }}
            </label>
            <input
              :value="modelValue[filter.key]"
              :type="filter.type || 'text'"
              :placeholder="filter.placeholder"
              class="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all border"
              style="
                background-color: var(--color-background);
                border-color: var(--color-border);
                color: var(--color-text);
              "
              @input="updateFilter(filter.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Filtros tipo Button Group -->
        <div v-if="buttonGroupFilters.length > 0" class="flex flex-col md:flex-row gap-4 mb-4">
          <div v-for="filter in buttonGroupFilters" :key="filter.key" class="space-y-2">
            <label
              v-if="filter.label"
              class="block text-sm font-semibold"
              style="color: var(--color-text)"
            >
              {{ filter.label }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in filter.options"
                :key="option.value"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
                :style="[
                  modelValue[filter.key] === option.value
                    ? {
                        backgroundColor: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)',
                        color: '#fff',
                      }
                    : {
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-muted)',
                      },
                ]"
                @click="updateFilter(filter.key, option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Botão Limpar -->
        <button
          v-if="activeFiltersCount > 0"
          class="flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1.5 hover:opacity-80"
          style="color: var(--color-danger)"
          @click="clearFilters"
        >
          <X class="w-4 h-4" />
          Limpar filtros
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Filter, X } from "lucide-vue-next";
import UiSelect from "@/components/ui/forms/UiSelect.vue";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterConfig {
  key: string;
  label?: string;
  type: "select" | "input" | "button-group";
  inputType?: string;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: string | number;
}

interface Props {
  modelValue: Record<string, any>;
  filters: FilterConfig[];
  columns?: number;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 5,
});

const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>];
}>();

const isOpen = ref(false);

const selectFilters = computed(() => props.filters.filter((f) => f.type === "select"));
const inputFilters = computed(() => props.filters.filter((f) => f.type === "input"));
const buttonGroupFilters = computed(() => props.filters.filter((f) => f.type === "button-group"));

const gridColsClass = computed(() => {
  const cols = props.columns;
  return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  props.filters.forEach((filter) => {
    const value = props.modelValue[filter.key];
    const defaultValue = filter.defaultValue;

    if (defaultValue !== undefined) {
      if (value !== defaultValue) count++;
    } else if (value && value !== "" && value !== "todos") {
      count++;
    }
  });
  return count;
});

const updateFilter = (key: string, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
};

const clearFilters = () => {
  const cleared: Record<string, any> = {};
  props.filters.forEach((filter) => {
    cleared[filter.key] = filter.defaultValue ?? "";
  });
  emit("update:modelValue", cleared);
};
</script>
