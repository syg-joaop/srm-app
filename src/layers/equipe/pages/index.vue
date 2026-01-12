<template>
  <div class="min-h-screen p-6 sm:p-8 bg-[var(--color-background)]">
    <!-- Header refinado com hierarquia clara -->
    <header class="mb-8">
      <div class="flex items-baseline justify-between mb-6">
        <div>
          <h1 class="text-[32px] font-semibold tracking-tight text-[var(--color-text)] mb-1">
            Equipe
          </h1>
        </div>
      </div>

      <!-- Toolbar com controles isolados -->
      <div class="sticky top-2 z-10">
        <div
          class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search -->
            <div class="relative flex-1 min-w-0">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
              />
              <input
                v-model="search"
                type="text"
                placeholder="Pesquisar membro..."
                class="w-full h-10 pl-10 pr-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all"
                @keyup.enter="handleSearch"
              />
            </div>

            <!-- Limpar pesquisa -->
            <Transition
              enter-active-class="transition-all duration-150"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-90"
            >
              <button
                v-if="searchQuery"
                class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-hover)] hover:border-[var(--color-danger)] active:scale-95 transition-all duration-150 group"
                @click="limparPesquisa"
                aria-label="Limpar pesquisa"
                title="Limpar pesquisa"
              >
                <X
                  class="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-danger)] transition-colors"
                />
              </button>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Contador -->
      <div class="mt-4">
        <p class="text-sm text-[var(--color-text-muted)] font-mono tabular-nums">
          {{ filteredMembros.length }} {{ filteredMembros.length === 1 ? "membro" : "membros" }}
        </p>
      </div>
    </header>

    <!-- Badges de filtros ativos -->
    <UiFilterBadges
      :filters="filterBadges"
      @remove="limparPesquisa"
      @clear-all="limparPesquisa"
    />

    <!-- Content -->
    <div>
      <div v-if="paginatedMembros.length > 0">
        <!-- Header da tabela -->
        <div
          class="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 mb-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg"
        >
          <div class="col-span-4">Nome</div>
          <div class="col-span-4">Email</div>
          <div class="col-span-2">Setor</div>
          <div class="col-span-2 text-right">Ações</div>
        </div>

        <div class="flex flex-col gap-2 md:gap-0" role="list">
          <TransitionGroup name="list" tag="div" class="contents">
            <MembroCardItem
              v-for="membro in paginatedMembros"
              :key="membro.id"
              :membro="membro"
              @click="handleSelectMembro"
            />
          </TransitionGroup>
        </div>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <UiPaginacao
            :page="currentPage"
            :total-pages="totalPages"
            class="mt-6"
            aria-label="Paginação de membros"
            @update:page="(p) => (currentPage = p)"
          />
        </Transition>
      </div>

      <!-- Empty state -->
      <div v-else class="py-20 text-center">
        <div class="max-w-md mx-auto">
          <div
            class="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <Users class="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 class="text-lg font-semibold text-[var(--color-text)] mb-2">
            {{ searchQuery ? "Nenhum membro encontrado" : "Nenhum membro cadastrado" }}
          </h3>
          <p class="text-sm text-[var(--color-text-muted)] mb-6">
            {{
              searchQuery
                ? "Tente ajustar a pesquisa ou limpar o termo."
                : "Os membros da equipe aparecerão aqui quando cadastrados."
            }}
          </p>
          <button
            v-if="searchQuery"
            class="inline-flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-primary)] text-white font-medium text-sm rounded-md hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all duration-150"
            @click="limparPesquisa"
          >
            <X class="w-4 h-4" />
            <span>Limpar Pesquisa</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalDetalhesParceiro v-model="showModal" :parceiro="membroSelecionado" variant="time" />
  </div>
</template>

<script setup lang="ts">
import { Search, Users, X } from "lucide-vue-next";

import ModalDetalhesParceiro from "~/components/common/ModalDetalhesParceiro.vue";
import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

import MembroCardItem, { type Membro } from "../components/MembroCardItem.vue";

definePageMeta({ layout: "default" });

const search = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

const showModal = ref(false);
const membroSelecionado = ref<Membro | null>(null);

const membrosMock: Membro[] = [
  { id: 1, nome: "Lucas candido", email: "Lucas Candido Soares de Figueiredo", setor: "ADMINISTRATIVO" },
  { id: 2, nome: "Junior", email: "eng.meirelesjunior@gmail.com", setor: "BALANCA" },
  { id: 3, nome: "Deyfferson", email: "WILKLIFFD@GMAIL.COM", setor: "ADMINISTRATIVO" },
  { id: 4, nome: "Michele", email: "micherlania.21@hotmail.com", setor: "FINANCEIRO" },
  { id: 5, nome: "Leticia", email: "leticiasilveiiira@gmail.com", setor: "ADMINISTRATIVO" },
  { id: 6, nome: "Joseilton", email: "JJ988815596@GMAIL.COM", setor: "SUCATA" },
  { id: 7, nome: "Raquel", email: "raquelruthinha.rl@gmail.com", setor: "RH" },
  { id: 8, nome: "Lucas absalao", email: "Lucasabsalao17@gmail.com", setor: "ADMINISTRATIVO" },
  { id: 9, nome: "Joao teixeira", email: "j.compal@hotmail.com", setor: "BALANCA" },
  { id: 10, nome: "Adriano", email: "fiscal3@reciaco.ind.br", setor: "ADMINISTRATIVO" },
  { id: 11, nome: "Carlos Silva", email: "carlos.silva@empresa.com", setor: "FINANCEIRO" },
  { id: 12, nome: "Maria Santos", email: "maria.santos@empresa.com", setor: "RH" },
  { id: 13, nome: "Pedro Costa", email: "pedro.costa@empresa.com", setor: "SUCATA" },
  { id: 14, nome: "Ana Oliveira", email: "ana.oliveira@empresa.com", setor: "ADMINISTRATIVO" },
  { id: 15, nome: "Bruno Ferreira", email: "bruno.ferreira@empresa.com", setor: "BALANCA" },
];

const handleSearch = () => {
  searchQuery.value = search.value;
  currentPage.value = 1;
};

const limparPesquisa = () => {
  search.value = "";
  searchQuery.value = "";
  currentPage.value = 1;
};

const filteredMembros = computed(() => {
  if (!searchQuery.value.trim()) {
    return membrosMock;
  }
  const query = searchQuery.value.toLowerCase();
  return membrosMock.filter(
    (m) =>
      m.nome.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.setor.toLowerCase().includes(query),
  );
});

const filterBadges = computed<FilterBadge[]>(() => {
  const badges: FilterBadge[] = [];
  if (searchQuery.value) {
    badges.push({ key: "search", label: "Busca", value: searchQuery.value });
  }
  return badges;
});

const totalPages = computed(() => Math.ceil(filteredMembros.value.length / itemsPerPage));

const paginatedMembros = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMembros.value.slice(start, end);
});

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const handleSelectMembro = (membro: Membro) => {
  membroSelecionado.value = { ...membro };
  showModal.value = true;
};
</script>

<style scoped>
.list-enter-active {
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.list-leave-active {
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.list-move {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
