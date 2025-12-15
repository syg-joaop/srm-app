<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        v-model="filters.fantasia"
        type="text"
        placeholder="Fantasia"
        class="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border"
        style="
          background-color: var(--color-surface);
          border-color: var(--color-border);
          color: var(--color-text);
        "
      />
      <input
        v-model="filters.cidade"
        type="text"
        placeholder="Cidade"
        class="w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border"
        style="
          background-color: var(--color-surface);
          border-color: var(--color-border);
          color: var(--color-text);
        "
      />
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold" style="color: var(--color-text)">Status</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
            :style="[
              filters.status === status.value
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
            @click="filters.status = status.value"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold" style="color: var(--color-text)">Ordenar por</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
            :style="[
              filters.sortBy === opt.value
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
            @click="filters.sortBy = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="flex items-end ml-auto">
        <button
          v-if="hasActiveFilters"
          class="flex items-center gap-1.5 text-sm font-medium transition-colors px-2 py-1.5"
          style="color: var(--color-status-vencido)"
          @click="clearFilters"
        >
          <X class="w-4 h-4" />
          Limpar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      fantasia: "",
      cidade: "",
      status: "todos",
      sortBy: "fornecedor",
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);

const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const statusOptions = [
  { label: "Todos", value: "todos" },
  { label: "Ativo", value: "ativo" },
  { label: "Inativo", value: "inativo" },
];

const sortOptions = [
  { label: "Fornecedor", value: "fornecedor" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Sem carga +60 dias", value: "sem_carga" },
];

const hasActiveFilters = computed(() => {
  return (
    filters.value.fantasia ||
    filters.value.cidade ||
    filters.value.status !== "todos" ||
    filters.value.sortBy !== "fornecedor"
  );
});

const clearFilters = () => {
  filters.value = {
    fantasia: "",
    cidade: "",
    status: "todos",
    sortBy: "fornecedor",
  };
};
</script>
