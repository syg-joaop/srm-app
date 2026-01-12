<template>
  <UiModal v-model="isOpen" size="large" :show-close="true" :close-on-overlay-click="!isSubmitting">
    <template #title>
      <div class="flex items-center gap-2">
        <RouteIcon class="w-5 h-5 text-[var(--color-primary)]" />
        <span>Cadastro de rota</span>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px] relative">
      <!-- Loading overlay -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isSubmitting"
          class="absolute inset-0 z-10 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-lg flex items-center justify-center"
          aria-hidden="true"
        >
          <div class="flex flex-col items-center gap-3">
            <UiSpinner size="large" variant="primary" />
            <p class="text-sm text-[var(--color-text-muted)]">Criando rota...</p>
          </div>
        </div>
      </Transition>

      <div class="lg:col-span-4 flex flex-col gap-6">
        <FormularioRota
          v-model:nome="formData.nome"
          v-model:data-inicio="formData.dataInicio"
          v-model:data-fim="formData.dataFim"
          v-model:observacoes="formData.observacoes"
          :disabled="isSubmitting"
        />

        <ListaFornecedoresRota
          v-model="fornecedores"
          v-model:novo-fornecedor="novoFornecedor"
          :disabled="isSubmitting"
          @add="addFornecedor"
          @remove="removeFornecedor"
        />
      </div>

      <div class="lg:col-span-8 min-h-[350px] lg:min-h-0">
        <div
          class="h-full rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)]"
          :class="{ 'opacity-50 pointer-events-none': isSubmitting }"
        >
          <UiMapaPontos :pontos="pontosMapa" class="w-full h-full" />
        </div>
      </div>
    </div>

    <template #footer>
      <UiButton
        variant="secondary"
        :disabled="isSubmitting"
        @click="handleCancel"
        aria-label="Cancelar e fechar modal"
      >
        Cancelar
      </UiButton>
      <UiButton
        variant="primary"
        :disabled="!isFormValid || isSubmitting"
        :loading="isSubmitting"
        @click="handleSave"
        aria-label="Criar nova rota"
      >
        <Plus v-if="!isSubmitting" class="w-4 h-4" />
        {{ isSubmitting ? 'Criando...' : 'Criar rota' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { Route as RouteIcon, Plus } from "lucide-vue-next";

import FormularioRota from "./FormularioRota.vue";
import ListaFornecedoresRota from "./ListaFornecedoresRota.vue";

import type { FornecedorRotaSimples } from "../schemas/rotas.schema";
import type { UiMapaPonto } from "~/components/ui/maps.types";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [data: typeof formData.value & { fornecedores: FornecedorRotaSimples[] }];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const formData = ref({
  nome: "",
  dataInicio: null as Date | null,
  dataFim: null as Date | null,
  observacoes: "",
});

const novoFornecedor = ref("");
const fornecedores = ref<FornecedorRotaSimples[]>([]);
const isSubmitting = ref(false);

const isFormValid = computed(() => {
  return (
    formData.value.nome.trim() !== "" &&
    formData.value.dataInicio !== null &&
    formData.value.dataFim !== null
  );
});

const pontosMapa = computed<UiMapaPonto[]>(() => {
  return fornecedores.value.map((f) => ({
    id: f.name,
    titulo: f.name,
    status: "ativo",
    latitude: f.lat,
    longitude: f.lng,
    linhas: [{ rotulo: "Cidade", valor: "Local" }],
  }));
});

const addFornecedor = () => {
  if (!novoFornecedor.value.trim()) return;

  const baseLat = -15.7801;
  const baseLng = -47.9292;
  const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
  const randomLng = baseLng + (Math.random() - 0.5) * 0.1;

  fornecedores.value.push({
    name: novoFornecedor.value.trim(),
    lat: randomLat,
    lng: randomLng,
  });

  novoFornecedor.value = "";
};

const removeFornecedor = (index: number) => {
  fornecedores.value.splice(index, 1);
};

const resetForm = () => {
  formData.value = {
    nome: "",
    dataInicio: null,
    dataFim: null,
    observacoes: "",
  };
  fornecedores.value = [];
  novoFornecedor.value = "";
  isSubmitting.value = false;
};

const handleCancel = () => {
  if (isSubmitting.value) return;
  resetForm();
  isOpen.value = false;
};

const handleSave = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  // Simula um delay para mostrar o loading state
  await new Promise(resolve => setTimeout(resolve, 1000));

  emit("save", {
    ...formData.value,
    fornecedores: fornecedores.value,
  });

  resetForm();
  isOpen.value = false;
};

// Reset form quando modal fecha
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>
