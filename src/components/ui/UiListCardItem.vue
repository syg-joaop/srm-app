<template>
  <article
    class="group/item relative bg-[var(--color-surface)] md:rounded-none last:md:rounded-b-lg rounded-lg md:border-[var(--color-border)] md:border-t-0 first:md:border-t border border-[var(--color-border)] transition-all duration-150 hover:border-[var(--color-primary-border)] md:hover:bg-[var(--color-primary-soft)] cursor-pointer"
    role="listitem"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <!-- Status Bar -->
    <div
      v-if="statusColor"
      class="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200"
      :style="{ backgroundColor: statusColor }"
      aria-hidden="true"
    />

    <div class="px-4 py-3">
      <!-- Mobile Layout -->
      <div class="md:hidden">
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <!-- Icon -->
            <div
              v-if="$slots.icon"
              class="mt-0.5 p-1.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]"
              aria-hidden="true"
            >
              <slot name="icon" />
            </div>
            <!-- Content -->
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-[var(--color-text)] text-sm truncate">
                <slot name="title" />
              </span>
              <span class="text-xs font-mono tabular-nums text-[var(--color-text-muted)] mt-0.5">
                <slot name="subtitle" />
              </span>
            </div>
          </div>
          <!-- Status Badge Mobile -->
          <slot name="status" />
        </div>

        <!-- Mobile Bottom Row -->
        <div class="flex items-center justify-between">
          <slot name="mobile-content" />
          <button
            class="group/details inline-flex items-center justify-center w-8 h-8 ml-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] active:scale-95 transition-all duration-150"
            @click.stop="$emit('click')"
            :aria-label="detailsLabel"
          >
            <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden md:grid gap-4 items-center" :style="{ gridTemplateColumns }">
        <!-- Main Content Column -->
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div
            v-if="$slots.icon"
            class="mt-1 p-1.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] transition-colors duration-150"
            aria-hidden="true"
          >
            <slot name="icon" />
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <span class="font-semibold text-[var(--color-text)] text-sm truncate transition-colors duration-150">
              <slot name="title" />
            </span>
            <span class="text-xs font-mono tabular-nums text-[var(--color-text-muted)] mt-0.5 truncate">
              <slot name="subtitle" />
            </span>
            <span v-if="$slots.meta" class="sm:inline hidden text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
              <slot name="meta" />
            </span>
          </div>
        </div>

        <!-- Custom Columns -->
        <slot name="columns" />

        <!-- Actions Column -->
        <div class="flex items-center justify-end gap-1.5">
          <slot name="actions">
            <button
              class="group/details inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] hover:border-[var(--color-primary-border)] transition-all duration-150 active:scale-95"
              @click.stop="$emit('click')"
              :aria-label="detailsLabel"
              title="Ver detalhes"
            >
              <ChevronRight class="w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-150 group-hover/details:translate-x-0.5" />
            </button>
          </slot>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";

interface Props {
  statusColor?: string;
  ariaLabel?: string;
  detailsLabel?: string;
  gridTemplateColumns?: string;
}

withDefaults(defineProps<Props>(), {
  statusColor: undefined,
  ariaLabel: "Item da lista",
  detailsLabel: "Ver detalhes",
  gridTemplateColumns: "5fr 2fr 2fr 3fr",
});

defineEmits<{
  (e: "click"): void;
}>();

defineOptions({ name: "UiListCardItem" });
</script>
