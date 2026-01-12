<template>
  <div class="flex flex-col gap-3" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-bold text-[var(--color-text)]">Fornecedores</h4>
      <span class="text-xs font-medium text-[var(--color-text-muted)]">
        {{ modelValue.length }} adicionado{{ modelValue.length !== 1 ? "s" : "" }}
      </span>
    </div>

    <div
      v-if="modelValue.length > 0"
      class="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1"
    >
      <div
        v-for="(fornecedor, index) in modelValue"
        :key="index"
        class="group/item flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary-border)] transition-colors"
      >
        <Building2 class="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
        <span class="text-sm text-[var(--color-text)] flex-1 truncate">
          {{ fornecedor.name }}
        </span>
        <div
          class="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
        >
          <button
            type="button"
            class="p-1.5 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ver no mapa"
            :disabled="disabled"
          >
            <MapPin class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="p-1.5 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remover"
            :disabled="disabled"
            @click="$emit('remove', index)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="py-4 text-center">
      <p class="text-sm text-[var(--color-text-muted)]">Nenhum fornecedor adicionado</p>
    </div>

    <div class="flex gap-2 items-center">
      <UiInput
        :model-value="novoFornecedor"
        placeholder="Nome do fornecedor"
        class="flex-1 !mb-0"
        :disabled="disabled"
        @update:model-value="$emit('update:novoFornecedor', $event)"
        @keyup.enter="!disabled && $emit('add')"
      />
      <button
        type="button"
        class="flex-shrink-0 w-10 h-10 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Adicionar fornecedor"
        :disabled="disabled"
        @click="$emit('add')"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, MapPin, Trash2, Plus } from "lucide-vue-next";

import type { FornecedorRotaSimples } from "../schemas/rotas.schema";

defineProps<{
  modelValue: FornecedorRotaSimples[];
  novoFornecedor: string;
  disabled?: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: FornecedorRotaSimples[]];
  "update:novoFornecedor": [value: string];
  add: [];
  remove: [index: number];
}>();
</script>
