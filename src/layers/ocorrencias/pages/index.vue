<template>
  <div class="min-h-screen p-4 sm:p-6 bg-[var(--color-background)]">
    <div class="flex flex-col gap-4 mb-6 sm:mb-8">
      <div class="flex items-center justify-between">
        <h1 class="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
          Ocorrências
        </h1>
        <UiButton
          variant="primary"
          size="medium"
          class="whitespace-nowrap sm:hidden"
        >
          <Plus class="w-4 h-4" />
        </UiButton>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <UiButton
          variant="primary"
          size="medium"
          class="whitespace-nowrap hidden sm:flex"
        >
          <Plus class="w-4 h-4" />
          Nova Ocorrência
        </UiButton>

        <div class="flex items-center gap-2 flex-1">
          <div class="relative flex-1 sm:max-w-xs">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar..."
              class="w-full pl-10 pr-4 py-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
            />
          </div>

          <UiButton
            variant="secondary"
            size="medium"
            :class="{ '!border-[var(--color-primary)] !text-[var(--color-primary)]': showFilters }"
            @click="showFilters = !showFilters"
          >
            <Filter class="w-4 h-4" />
          </UiButton>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showFilters" class="mb-6 p-3 sm:p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
          <UiSelect
            v-model="filtroAtendente"
            label="Atendente"
            :options="atendenteOptions"
            placeholder="Selecione o atendente"
          />
          <UiSelect
            v-model="filtroSituacao"
            label="Situação"
            :options="situacaoOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="filtroFormaAtendimento"
            label="Forma de Atendimento"
            :options="formaAtendimentoOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="filtroStatus"
            label="Status"
            :options="statusOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="ordenarPor"
            label="Ordenar por"
            :options="ordenacaoOptions"
            placeholder="Data de cadastro"
          />
        </div>
        <UiButton variant="ghost" size="small" @click="limparFiltros">
          <X class="w-4 h-4" />
          Limpar filtros
        </UiButton>
      </div>
    </Transition>

    <div
      class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-background)] rounded-t-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
    >
      <div class="col-span-4">Descrição</div>
      <div class="col-span-3">Fornecedor</div>
      <div class="col-span-2 text-center">Data</div>
      <div class="col-span-2 text-center">Atendente</div>
      <div class="col-span-1 text-end">Ações</div>
    </div>

    <div class="flex flex-col gap-1.5 md:gap-0">
      <div
        v-for="item in ocorrenciasFiltradas"
        :key="item.id"
        class="group/item relative bg-[var(--color-surface)] md:rounded-none first:md:rounded-t-none last:md:rounded-b-lg rounded-lg border border-[var(--color-border-subtle)] md:border-[var(--color-border)] md:border-t-0 first:md:border-t hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)] transition-all duration-300 ease-out hover:shadow-sm px-3 py-3 md:px-6 md:py-3 cursor-pointer"
        @click="abrirDetalhes(item)"
      >
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-primary)] rounded-r-full opacity-0 group-hover/item:h-6 group-hover/item:opacity-100 transition-all duration-300"
        ></div>

        <div class="hidden md:grid md:grid-cols-12 gap-4 items-center">
          <div class="col-span-4 flex items-center gap-3">
            <div
              class="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200"
              :class="getStatusIconClass(item.status)"
            >
              <MessageSquare class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate">
                {{ item.titulo || "Sem descrição" }}
              </span>
            </div>
          </div>

          <div class="col-span-3 flex items-center">
            <span class="text-sm text-[var(--color-text-muted)]">
              {{ item.fornecedor }}
            </span>
          </div>

          <div class="col-span-2 flex items-center justify-center">
            <span class="text-sm text-[var(--color-text-muted)]">
              {{ item.dataCadastro || "—" }}
            </span>
          </div>

          <div class="col-span-2 flex items-center justify-center">
            <span class="text-sm text-[var(--color-text-muted)]">
              {{ item.atendente }}
            </span>
          </div>

          <div class="col-span-1 flex items-center justify-end">
            <UiButton variant="ghost" size="small" class="!px-2">
              <Eye class="w-4 h-4" />
            </UiButton>
          </div>
        </div>

        <div class="flex md:hidden flex-col gap-1">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="getStatusIconClass(item.status)"
              >
                <MessageSquare class="w-3.5 h-3.5" />
              </div>
              <span class="font-semibold text-[var(--color-text)] text-sm group-hover/item:text-[var(--color-primary)] transition-colors truncate">
                {{ item.fornecedor }}
              </span>
            </div>
            <span class="text-[11px] text-[var(--color-text-muted)] whitespace-nowrap flex-shrink-0">
              {{ item.dataCadastro || "Sem data" }}
            </span>
          </div>
          <div class="pl-10">
            <span class="text-[11px] text-[var(--color-text-muted)] line-clamp-1">
              {{ item.titulo || "Sem descrição" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <UiEmptyState
      v-if="ocorrenciasFiltradas.length === 0"
      title="Nenhuma ocorrência encontrada"
      description="Não há ocorrências que correspondam aos filtros selecionados."
    >
      <template #icon>
        <MessageSquare class="w-12 h-12" />
      </template>
      <template #action>
        <UiButton variant="primary">
          <Plus class="w-4 h-4" />
          Nova Ocorrência
        </UiButton>
      </template>
    </UiEmptyState>

    <UiPaginacao
      v-if="ocorrenciasFiltradas.length > 0"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      class="mt-6"
    />

    <ModalDetalhesOcorrencia
      v-model="showModal"
      :ocorrencia="ocorrenciaSelecionada"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, Filter, MessageSquare, Plus, Eye, X } from "lucide-vue-next";
import UiButton from "@/components/ui/buttons/UiButton.vue";
import UiEmptyState from "@/components/ui/feedback/UiEmptyState.vue";
import UiSelect from "@/components/ui/forms/UiSelect.vue";
import UiPaginacao from "@/components/ui/navigation/UiPaginacao.vue";
import ModalDetalhesOcorrencia from "../components/ModalDetalhesOcorrencia.vue";

definePageMeta({
  layout: "default",
});

type OcorrenciaStatus = "pendente" | "acompanhamento" | "concluida";

interface Ocorrencia {
  id: number;
  titulo?: string;
  fornecedor: string;
  dataCadastro?: string;
  atendente: string;
  status: OcorrenciaStatus;
  proximoAtendimento?: string;
  encaminhadoPara?: string;
  diagnosticadoPor?: string;
  formaAtendimento?: string;
  situacao?: string;
}

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showFilters = ref(false);
const showModal = ref(false);
const ocorrenciaSelecionada = ref<Ocorrencia | null>(null);

const filtroAtendente = ref<string | null>(null);
const filtroSituacao = ref<string | null>(null);
const filtroFormaAtendimento = ref<string | null>(null);
const filtroStatus = ref<string | null>(null);
const ordenarPor = ref<string | null>("data_cadastro");

const atendenteOptions = [
  { label: "Selecione o atendente", value: "" },
  { label: "Sygecom", value: "Sygecom" },
  { label: "Dahm", value: "Dahm" },
  { label: "Alexnlv", value: "Alexnlv" },
  { label: "Alex sygecom", value: "Alex sygecom" },
];

const situacaoOptions = [
  { label: "Todos", value: "" },
  { label: "Aberta", value: "aberta" },
  { label: "Fechada", value: "fechada" },
];

const formaAtendimentoOptions = [
  { label: "Todos", value: "" },
  { label: "Via Web", value: "web" },
  { label: "Telefone", value: "telefone" },
  { label: "Presencial", value: "presencial" },
];

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Pendente", value: "pendente" },
  { label: "Em Acompanhamento", value: "acompanhamento" },
  { label: "Atendimento Ok", value: "concluida" },
];

const ordenacaoOptions = [
  { label: "Data da Ocorrência", value: "data_ocorrencia" },
  { label: "Data do Próx. Atendimento", value: "data_proximo" },
  { label: "Data de cadastro", value: "data_cadastro" },
];

const ocorrencias = ref<Ocorrencia[]>([
  { id: 1, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Sygecom", status: "pendente" },
  { id: 2, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Sygecom", status: "pendente" },
  { id: 3, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Sygecom", status: "concluida" },
  { id: 4, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Sygecom", status: "acompanhamento" },
  { id: 5, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Dahm", status: "acompanhamento" },
  { id: 6, titulo: "Sem descrição", fornecedor: "Joao Teste", dataCadastro: "", atendente: "Dahm", status: "acompanhamento" },
  { id: 7, titulo: "Sem descrição", fornecedor: "19 Servico Notarial", dataCadastro: "19/11/2025", atendente: "Alexnlv", status: "pendente" },
  { id: 8, titulo: "Usisiuwuwuuwu", fornecedor: "Bruno Teste", dataCadastro: "04/11/2025", atendente: "Alexnlv", status: "concluida" },
  { id: 9, titulo: "Kakakqkq", fornecedor: "Cassandra Oliveira", dataCadastro: "04/11/2025", atendente: "Alexnlv", status: "concluida" },
]);

const ocorrenciasFiltradas = computed(() => {
  let resultado = ocorrencias.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    resultado = resultado.filter(
      (o) =>
        o.titulo?.toLowerCase().includes(query) ||
        o.fornecedor.toLowerCase().includes(query) ||
        o.atendente.toLowerCase().includes(query)
    );
  }

  if (filtroAtendente.value) {
    resultado = resultado.filter((o) => o.atendente === filtroAtendente.value);
  }

  if (filtroStatus.value) {
    resultado = resultado.filter((o) => o.status === filtroStatus.value);
  }

  return resultado;
});

const totalPages = computed(() => Math.ceil(ocorrenciasFiltradas.value.length / itemsPerPage) || 1);

const getStatusIconClass = (status: OcorrenciaStatus): string => {
  const map: Record<OcorrenciaStatus, string> = {
    pendente: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
    acompanhamento: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    concluida: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  };
  return map[status];
};

const abrirDetalhes = (ocorrencia: Ocorrencia) => {
  ocorrenciaSelecionada.value = ocorrencia;
  showModal.value = true;
};

const limparFiltros = () => {
  filtroAtendente.value = null;
  filtroSituacao.value = null;
  filtroFormaAtendimento.value = null;
  filtroStatus.value = null;
  ordenarPor.value = "data_cadastro";
};
</script>
