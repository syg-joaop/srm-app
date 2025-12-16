<template>
  <div
    class="min-h-screen p-4 sm:p-6"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold">Concorrentes</h1>

      <div class="relative w-full sm:w-80">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style="color: var(--color-text-muted)"
        />
        <input
          v-model="search"
          type="text"
          placeholder="Buscar concorrente"
          class="w-full rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all border"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
          "
        />
      </div>
    </div>

    <UiCard class="p-4 sm:p-6">
      <div v-if="isLoading" class="flex items-center justify-center py-10">
        <UiSpinner />
      </div>

      <div v-else-if="paginatedConcorrentes.length > 0" class="divide-y divide-[var(--color-border)]">
        <div
          v-for="item in paginatedConcorrentes"
          :key="item.id"
          class="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3"
        >
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-[var(--color-text)] truncate">{{ item.nome }}</p>
            <p class="text-sm text-[var(--color-text-muted)] truncate">{{ formatLocation(item) }}</p>
            <p v-if="item.segmento" class="text-xs text-[var(--color-text-muted)]">Segmento: {{ item.segmento }}</p>
            <p v-if="item.observacao" class="text-xs text-[var(--color-text-muted)] mt-1 truncate">
              {{ item.observacao }}
            </p>
          </div>

          <div class="flex flex-col items-start sm:items-end gap-1 text-xs text-[var(--color-text-muted)]">
            <UiBadge v-if="item.status" size="small" variant="secondary">
              {{ item.status }}
            </UiBadge>
            <span v-if="item.telefone" class="font-medium text-[var(--color-text)]">{{ item.telefone }}</span>
          </div>
        </div>
      </div>

      <UiEmptyState
        v-else
        title="Nenhum concorrente encontrado"
        description="Ainda não há concorrentes cadastrados para mostrar aqui."
      >
        <template #icon>
          <Users class="w-12 h-12" />
        </template>
      </UiEmptyState>
    </UiCard>

    <UiPaginacao
      v-if="paginatedConcorrentes.length > 0 && totalPages > 1"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Search, Users } from "lucide-vue-next";
import UiBadge from "~/components/ui/UiBadge.vue";
import UiCard from "~/components/ui/UiCard.vue";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiPaginacao from "~/components/ui/UiPaginacao.vue";
import UiSpinner from "~/components/ui/UiSpinner.vue";
import { useConcorrenteService } from "../composables/useConcorrenteService";
import type { Concorrente, ConcorrenteFilters } from "../concorrentes.types";

definePageMeta({ layout: "default" });

const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

const { fetchConcorrentes } = useConcorrenteService();

const filters = computed<ConcorrenteFilters>(() => ({
  search: search.value,
}));

watch(search, () => {
  currentPage.value = 1;
});

const { data: concorrentesResponse, status } = fetchConcorrentes(currentPage, itemsPerPage, filters);

const isLoading = computed(() => status.value === "pending");

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
};

const normalizeConcorrente = (raw: Record<string, unknown>): Concorrente => ({
  id:
    toNumber(raw.id) ??
    toNumber(raw.sr_recno) ??
    toNumber(raw.codigo) ??
    toNumber(raw.cod_concorrente) ??
    Date.now(),
  nome:
    toStringValue(raw.nome) ??
    toStringValue(raw.concorrente) ??
    toStringValue(raw.empresa) ??
    toStringValue(raw.apelido) ??
    "—",
  cidade: toStringValue(raw.cidade) ?? toStringValue(raw.municipio),
  estado: toStringValue(raw.estado) ?? toStringValue(raw.uf),
  telefone: toStringValue(raw.telefone) ?? toStringValue(raw.celular) ?? toStringValue(raw.fone),
  segmento: toStringValue(raw.segmento) ?? toStringValue(raw.categoria),
  observacao: toStringValue(raw.observacao) ?? toStringValue(raw.obs),
  status: toStringValue(raw.status) ?? toStringValue(raw.situacao),
});

const concorrentes = computed(() => (concorrentesResponse.value?.data?.items ?? []).map(normalizeConcorrente));

const fallbackTotalItems = computed(
  () => concorrentesResponse.value?.data?.totalItems ?? concorrentes.value.length,
);

const totalPages = computed(
  () =>
    concorrentesResponse.value?.data?.totalPages ??
    Math.max(1, Math.ceil((fallbackTotalItems.value || 0) / itemsPerPage.value)),
);

const paginatedConcorrentes = computed(() => {
  const items = concorrentes.value.filter((item) => {
    if (!search.value) return true;

    const normalizedSearch = search.value.toLowerCase();
    return item.nome.toLowerCase().includes(normalizedSearch);
  });

  if (concorrentesResponse.value?.data?.totalPages) return items;

  const start = (currentPage.value - 1) * itemsPerPage.value;
  return items.slice(start, start + itemsPerPage.value);
});

const formatLocation = (item: Concorrente) => {
  if (!item.cidade && !item.estado) return "Localização não informada";
  if (!item.estado) return item.cidade;
  if (!item.cidade) return item.estado;
  return `${item.cidade} - ${item.estado}`;
};
</script>
