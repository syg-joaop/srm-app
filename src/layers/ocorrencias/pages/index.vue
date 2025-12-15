<template>
  <div class="min-h-screen p-4 sm:p-6 pb-20 bg-[var(--color-background)]">
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[var(--color-text)]">Ocorrências</h1>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2 w-full md:max-w-xl">
        <UiButton variant="primary" size="medium" class="whitespace-nowrap hidden sm:flex">
          <Plus class="w-4 h-4" />
          Nova Ocorrência
        </UiButton>

        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style="color: var(--color-text-muted)"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pesquisar..."
            class="w-full rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border"
            style="
              background-color: var(--color-surface);
              border-color: var(--color-border);
              color: var(--color-text);
            "
          />
        </div>

        <button
          class="p-2.5 rounded-lg border transition-colors relative"
          :style="[
            showFilters
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
          @click="showFilters = !showFilters"
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
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showFilters"
        class="mb-6 p-3 sm:p-4 rounded-lg border"
        style="border-color: var(--color-border); background-color: var(--color-surface)"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
          <UiSelect
            v-model="filters.atendente"
            label="Atendente"
            :options="atendenteOptions"
            placeholder="Selecione o atendente"
          />
          <UiSelect
            v-model="filters.situacao"
            label="Situação"
            :options="situacaoOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="filters.formaAtendimento"
            label="Forma de Atendimento"
            :options="formaAtendimentoOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="filters.status"
            label="Status"
            :options="statusOptions"
            placeholder="Todos"
          />
          <UiSelect
            v-model="filters.ordenarPor"
            label="Ordenar por"
            :options="ordenarPorOptions"
            placeholder="Data de cadastro"
          />
        </div>

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

    <div
      class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-background)] rounded-t-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider"
    >
      <div class="col-span-1">Status</div>
      <div class="col-span-3">Fornecedor</div>
      <div class="col-span-2">Data Cadastro</div>
      <div class="col-span-2">Atendente</div>
      <div class="col-span-3">Título</div>
      <div class="col-span-1 text-center">Ações</div>
    </div>

    <div v-if="ocorrenciasFiltradas.length > 0" class="flex flex-col gap-1.5 md:gap-0">
      <div
        v-for="item in paginatedOcorrencias"
        :key="item.id"
        class="group/item relative bg-[var(--color-surface)] md:rounded-none first:md:rounded-t-none last:md:rounded-b-lg rounded-lg border border-[var(--color-border-subtle)] md:border-[var(--color-border)] md:border-t-0 first:md:border-t hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)] transition-all duration-300 ease-out hover:shadow-sm px-4 py-4 md:px-6 md:py-4 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4"
        @click="abrirDetalhes(item)"
      >
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-primary)] rounded-r-full opacity-0 group-hover/item:h-6 group-hover/item:opacity-100 transition-all duration-300"
        ></div>

        <div class="hidden md:flex items-center gap-3 md:col-span-1">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200"
            :class="getStatusIconClass(item.status)"
          >
            <Eye class="w-4 h-4" />
          </div>
        </div>

        <div class="hidden md:flex items-center col-span-3">
          <span
            class="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors truncate"
          >
            {{ item.fornecedor }}
          </span>
        </div>

        <div class="flex md:hidden flex-col gap-1 w-full min-w-0">
          <div class="flex items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="getStatusIconClass(item.status)"
              >
                <Eye class="w-3.5 h-3.5" />
              </div>
              <span
                class="text-sm font-medium text-[var(--color-text)] group-hover/item:text-[var(--color-primary)] transition-colors truncate"
              >
                {{ item.fornecedor }}
              </span>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="text-[10px] text-[var(--color-text-muted)]">
                {{ item.dataCadastro }}
              </span>
              <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
          </div>

          <div
            class="flex items-center justify-between gap-2 pl-[42px] text-xs text-[var(--color-text-muted)] w-full"
          >
            <span class="truncate pr-2">{{ item.titulo || "Sem descrição" }}</span>
            <span class="whitespace-nowrap flex-shrink-0">{{ item.atendente }}</span>
          </div>
        </div>

        <div
          class="hidden md:flex items-center text-xs md:text-sm text-[var(--color-text-muted)] md:col-span-2"
        >
          {{ item.dataCadastro || "-" }}
        </div>

        <div
          class="hidden md:flex items-center text-xs md:text-sm text-[var(--color-text-muted)] md:col-span-2"
        >
          {{ item.atendente }}
        </div>

        <div
          class="hidden md:flex items-center text-xs md:text-sm text-[var(--color-text-muted)] md:col-span-3"
        >
          <span class="truncate">{{ item.titulo || "Sem descrição" }}</span>
        </div>

        <div class="hidden md:flex items-center justify-center col-span-1">
          <button
            class="p-2 rounded-lg hover:bg-[var(--color-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            @click.stop="abrirDetalhes(item)"
          >
            <Eye class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UiEmptyState
      v-else
      title="Nenhuma ocorrência encontrada"
      description="Não há ocorrências cadastradas ou que correspondam aos filtros aplicados."
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

    <ModalDetalhesOcorrencia v-model="showModal" :ocorrencia="ocorrenciaSelecionada" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, Filter, MessageSquare, Plus, Eye, X, ChevronRight } from "lucide-vue-next";
import UiButton from "~/components/ui/UiButton.vue";
import UiSelect from "~/components/ui/UiSelect.vue";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
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

const showFilters = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showModal = ref(false);
const ocorrenciaSelecionada = ref<Ocorrencia | null>(null);

const filters = ref({
  atendente: "",
  situacao: "",
  formaAtendimento: "",
  status: "",
  ordenarPor: "data_cadastro",
});

const atendenteOptions = [
  { label: "Todos", value: "" },
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

const ordenarPorOptions = [
  { label: "Data da Ocorrência", value: "data_ocorrencia" },
  { label: "Data do Próx. Atendimento", value: "data_proximo" },
  { label: "Data de cadastro", value: "data_cadastro" },
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.atendente) count++;
  if (filters.value.situacao) count++;
  if (filters.value.formaAtendimento) count++;
  if (filters.value.status) count++;
  if (filters.value.ordenarPor !== "data_cadastro") count++;
  return count;
});

const clearFilters = () => {
  filters.value = {
    atendente: "",
    situacao: "",
    formaAtendimento: "",
    status: "",
    ordenarPor: "data_cadastro",
  };
};

const ocorrencias = ref<Ocorrencia[]>([
  {
    id: 1,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Sygecom",
    status: "pendente",
  },
  {
    id: 2,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Sygecom",
    status: "pendente",
  },
  {
    id: 3,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Sygecom",
    status: "concluida",
  },
  {
    id: 4,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Sygecom",
    status: "acompanhamento",
  },
  {
    id: 5,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Dahm",
    status: "acompanhamento",
  },
  {
    id: 6,
    titulo: "Sem descrição",
    fornecedor: "Joao Teste",
    dataCadastro: "",
    atendente: "Dahm",
    status: "acompanhamento",
  },
  {
    id: 7,
    titulo: "Sem descrição",
    fornecedor: "19 Servico Notarial",
    dataCadastro: "19/11/2025",
    atendente: "Alexnlv",
    status: "pendente",
  },
  {
    id: 8,
    titulo: "Usisiuwuwuuwu",
    fornecedor: "Bruno Teste",
    dataCadastro: "04/11/2025",
    atendente: "Alexnlv",
    status: "concluida",
  },
  {
    id: 9,
    titulo: "Kakakqkq",
    fornecedor: "Cassandra Oliveira",
    dataCadastro: "04/11/2025",
    atendente: "Alexnlv",
    status: "concluida",
  },
]);

const ocorrenciasFiltradas = computed(() => {
  let resultado = ocorrencias.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    resultado = resultado.filter(
      (o) =>
        o.titulo?.toLowerCase().includes(query) ||
        o.fornecedor.toLowerCase().includes(query) ||
        o.atendente.toLowerCase().includes(query),
    );
  }

  if (filters.value.atendente) {
    resultado = resultado.filter((o) => o.atendente === filters.value.atendente);
  }

  if (filters.value.status) {
    resultado = resultado.filter((o) => o.status === filters.value.status);
  }

  return resultado;
});

const paginatedOcorrencias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return ocorrenciasFiltradas.value.slice(start, start + itemsPerPage);
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
</script>
