<template>
  <UiModal
    :model-value="modelValue"
    size="large"
    :show-close="isDesktop"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="$emit('close')"
  >
    <template #title>
      <div class="flex pt-2 flex-col md:flex-row md:items-center gap-3 w-full overflow-hidden pb-1">
        <div class="flex items-center gap-3 w-full md:w-auto min-w-0 flex-1">
          <div
            class="h-6 w-1 md:h-8 rounded-full shrink-0"
            :class="isInactive ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-primary)]'"
          ></div>
          <h2
            class="text-lg md:text-2xl font-bold text-[var(--color-text)] truncate flex-1 min-w-0"
          >
            {{ parceiro?.name || "Detalhes do Parceiro" }}
          </h2>
          <!-- Botão de fechar customizado apenas para mobile -->
          <button
            class="md:hidden p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
            @click="
              $emit('update:modelValue', false);
              $emit('close');
            "
            aria-label="Fechar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div
          v-if="variant !== 'time'"
          class="flex items-center gap-2 w-full md:w-auto md:ml-auto md:mr-8 border-t md:border-t-0 border-[var(--color-border)] pt-3 md:pt-0"
        >
          <UiButton
            variant="ghost"
            class="!px-2 !py-1 !text-[var(--color-primary)] hover:bg-[var(--color-hover)] shrink-0"
          >
            <template #default>
              <div class="flex items-center gap-2">
                <MessageSquare class="w-5 h-5 shrink-0" />
                <span class="text-sm font-medium">Atender</span>
              </div>
            </template>
          </UiButton>

          <div class="h-6 w-px bg-[var(--color-border)] mx-1"></div>

          <div class="flex items-center gap-1">
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Presentation class="w-5 h-5" />
            </button>
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <UserPlus class="w-5 h-5" />
            </button>
            <button
              class="p-2 hover:bg-[var(--color-hover)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <Edit class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-4 -mx-6">
      <div class="relative w-full">
        <div
          class="tabs-scroll-container flex items-center gap-5 px-6 border-b border-[var(--color-border)] mb-6 overflow-x-auto no-scrollbar scroll-smooth"
        >
          <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            :ref="
              (el) => {
                if (el) tabButtonRefs[index] = el as HTMLElement;
              }
            "
            class="pb-3 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap shrink-0"
            :class="[
              activeTab === tab.id
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ]"
            @click="selectTab(tab.id, index)"
          >
            {{ tab.label }}
            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-full"
            ></div>
          </button>
          <div class="w-6 shrink-0 h-1"></div>
        </div>
      </div>

      <div class="px-6 min-h-[280px] md:min-h-[400px]">
        <Transition name="fade" mode="out-in">
          <div :key="activeTabMeta.id" class="space-y-4">
            <!-- Tab de cadastro com layout em seções -->
            <div v-if="activeTab === 'cadastro' && activeTabMeta.items.length" class="space-y-3">
              <div v-for="item in activeTabMeta.items" :key="item.id">
                <!-- Badge de status do fornecedor -->
                <div v-if="item.status" class="mb-3">
                  <span
                    class="text-[10px] font-semibold px-2 py-1 rounded-full border"
                    :class="getStatusClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>

                <!-- Seção 1: Identificação -->
                <div
                  v-if="filterCadastroFields.getIdentification(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 mb-3"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Identificação
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getIdentification(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Seção 2: Localização -->
                <div
                  v-if="filterCadastroFields.getLocation(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 mb-3"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Localização
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getLocation(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Seção 3: Informações Adicionais -->
                <div
                  v-if="filterCadastroFields.getAdditional(item.details).length"
                  class="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
                >
                  <h3
                    class="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3"
                  >
                    Informações Adicionais
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                    <div
                      v-for="detail in filterCadastroFields.getAdditional(item.details)"
                      :key="detail.label"
                      class="min-w-0"
                    >
                      <p class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        {{ detail.label }}
                      </p>
                      <p
                        class="text-xs font-semibold truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                        :title="detail.value"
                      >
                        {{ detail.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabs de listagem (exceto cadastro) -->
            <div v-else-if="activeTabMeta.items.length" class="space-y-1.5">
              <div
                v-for="item in activeTabMeta.items"
                :key="item.id"
                class="group/item relative rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 transition-all duration-300 ease-out hover:border-[var(--color-primary-border)] hover:bg-[var(--color-primary-soft)]"
              >
                <div
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[var(--color-primary)] rounded-r-full opacity-0 group-hover/item:h-4 group-hover/item:opacity-100 transition-all duration-300"
                ></div>

                <!-- Linha 1: Título + Status -->
                <div class="flex items-center gap-2 min-w-0">
                  <p
                    class="text-sm font-semibold text-[var(--color-text)] truncate flex-1 min-w-0"
                    :title="item.title"
                  >
                    {{ item.title }}
                  </p>
                  <span
                    v-if="item.status"
                    class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded border"
                    :class="getStatusClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>

                <!-- Linha 2: Detalhes inline -->
                <div
                  v-if="item.details.length"
                  class="flex flex-wrap md:flex-nowrap items-center gap-1.5 md:truncate mt-1 min-w-0"
                >
                  <template v-for="(detail, idx) in item.details.slice(0, 4)" :key="detail.label">
                    <span
                      class="text-[10px] text-[var(--color-border-subtle)] shrink-0"
                      v-if="idx > 0"
                    >
                      •
                    </span>
                    <span
                      class="inline-flex items-center gap-0.5 truncate md:truncate"
                      :title="`${detail.label}: ${detail.value}`"
                    >
                      <span
                        class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider shrink-0"
                      >
                        {{ detail.label }}:
                      </span>
                      <span
                        class="text-xs font-medium truncate"
                        :class="
                          detail.value === '-'
                            ? 'text-[var(--color-text-muted)]'
                            : 'text-[var(--color-text)]'
                        "
                      >
                        {{ detail.value }}
                      </span>
                    </span>
                  </template>
                  <span
                    v-if="item.details.length > 4"
                    class="text-[10px] text-[var(--color-text-muted)] shrink-0"
                  >
                    +{{ item.details.length - 4 }}
                  </span>
                </div>
              </div>
            </div>

            <UiEmptyState
              v-else
              :icon="MessageSquare"
              :title="activeTabMeta.emptyTitle"
              :description="activeTabMeta.emptyDescription"
            />
          </div>
        </Transition>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { Edit, MessageSquare, Presentation, UserPlus } from "lucide-vue-next";
import UiButton from "~/components/ui/UiButton.vue";
import UiEmptyState from "~/components/ui/UiEmptyState.vue";
import UiModal from "~/components/ui/UiModal.vue";
import type { ParceiroData, ParceiroVariant, TabId } from "~/types/parceiro";
import { useParceiroTabs, filterCadastroFields } from "./composables/useParceiroTabs";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    parceiro?: ParceiroData | null;
    variant?: ParceiroVariant;
  }>(),
  {
    parceiro: null,
    variant: "parceiro",
  },
);

defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// Composable de tabs
const {
  activeTab,
  tabButtonRefs,
  tabs,
  activeTabMeta,
  isInactive,
  selectTab,
} = useParceiroTabs(props);

// Responsividade
const isDesktop = ref(false);

const checkIfDesktop = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  checkIfDesktop();
  window.addEventListener("resize", checkIfDesktop);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfDesktop);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tabs-scroll-container {
  mask-image: linear-gradient(to right, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
</style>
