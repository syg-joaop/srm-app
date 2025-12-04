<template>
  <div
    class="flex flex-col h-full rounded-2xl border shadow-lg transition-all duration-300 group relative hover:shadow-xl"
    style="
      background-color: var(--color-surface);
      border-color: var(--color-border-subtle);
    "
  >
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
    ></div>

    <div
      class="px-6 pt-4 pb-3 flex justify-between items-center border-b shrink-0"
      style="border-color: var(--color-border-subtle)"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-1 h-4 rounded-full bg-primary shadow-[0_0_8px_rgba(0,153,255,0.5)]"
        ></div>
        <div>
          <h3
            class="font-bold text-base leading-none tracking-tight"
            style="color: var(--color-text)"
          >
            {{ title }}
          </h3>
          <p
            v-if="subtitle"
            class="text-[11px] font-medium mt-1.5"
            style="color: var(--color-text-muted)"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>
      <div
        class="transition-colors hover:opacity-80"
        style="color: var(--color-text-muted)"
      >
        <slot name="action" />
      </div>
    </div>

    <div class="px-6 py-2 relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
      <slot :paginatedItems="paginatedItems" />
    </div>

    <div
      v-if="$slots.footer || (paginated && items && totalPages > 1)"
      class="px-6 py-2 text-xs border-t shrink-0 mt-auto"
      style="
        color: var(--color-text-muted);
        border-color: var(--color-border-subtle);
      "
    >
      <div
        v-if="paginated && items && totalPages > 1"
        class="flex items-center justify-center gap-4 w-full"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 transition-colors"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="font-medium">
          {{ currentPage }} <span class="opacity-50 mx-1">/</span>
          {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 transition-colors"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <slot name="footer" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    items?: any[];
    pageSize?: number;
    paginated?: boolean;
  }>(),
  {
    pageSize: 6,
    paginated: false,
  }
);

const currentPage = ref(1);

const totalPages = computed(() =>
  props.items ? Math.ceil(props.items.length / props.pageSize) : 0
);

const paginatedItems = computed(() => {
  if (!props.items) return [];
  if (!props.paginated) return props.items;
  const start = (currentPage.value - 1) * props.pageSize;
  return props.items.slice(start, start + props.pageSize);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>
