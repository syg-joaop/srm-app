<template>
  <article
    class="group/item relative rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all duration-300 ease-out hover:border-[var(--color-primary-border)] hover:shadow-md cursor-pointer focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background)]"
    :tabindex="expandable ? 0 : undefined"
    role="button"
    :aria-expanded="isExpanded"
    @click="toggleExpand"
    @keydown.enter="toggleExpand"
    @keydown.space.prevent="toggleExpand"
  >
    <div class="flex items-center gap-2">
      <!-- Icon -->
      <component :is="icon" class="w-4 h-4 text-[var(--color-primary)] shrink-0" />

      <!-- Title & Status & Right Label -->
      <div class="flex-1 min-w-0 flex items-center justify-between gap-2">
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-[var(--color-text)] truncate"
            :title="title"
          >
            {{ title }}
          </p>
          <p
            v-if="subtitle"
            class="text-xs text-[var(--color-text-muted)] truncate"
            :title="subtitle"
          >
            {{ subtitle }}
          </p>
        </div>

        <!-- Right Label (date or other info) -->
        <p
          v-if="rightLabel"
          class="text-xs font-medium text-[var(--color-primary)] shrink-0"
          :title="rightLabel"
        >
          {{ rightLabel }}
        </p>
      </div>

      <!-- Status Badge -->
      <UiBadge
        v-if="status"
        :variant="statusVariant ? statusVariant(status) : 'default'"
        size="small"
        class="shrink-0"
      >
        {{ status }}
      </UiBadge>

      <!-- Expand Indicator -->
      <ChevronDown
        v-if="expandable && details.length > 0"
        class="w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-300 ml-1 shrink-0"
        :class="{ 'rotate-180': isExpanded }"
      />
    </div>

    <!-- Details (shown when expanded) -->
    <Transition
      :name="isExpanded ? 'expand' : 'collapse'"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        v-if="isExpanded && details.length > 0"
        ref="detailsContainer"
        class="overflow-hidden mt-3"
      >
        <!-- List layout for items with long labels (like products list) -->
        <div v-if="detailsLayout === 'list'" class="space-y-2">
          <div
            v-for="detail in details"
            :key="detail.label"
            class="py-2 rounded"
            :class="isSeparatorDetail(detail) ? 'border-t border-[var(--color-border)] pt-4 mt-2' : isTotalDetail(detail) ? 'bg-[var(--color-hover)] px-3 mt-2' : 'pl-3'"
          >
            <p
              v-if="!isSeparatorDetail(detail)"
              class="text-xs font-semibold mb-1"
              :class="isTotalDetail(detail) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'"
            >
              {{ detail.label }}
            </p>
            <p
              v-if="!isSeparatorDetail(detail)"
              class="text-xs"
              :class="isTotalDetail(detail) ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-muted)]'"
            >
              {{ detail.value }}
            </p>
          </div>
        </div>

        <!-- Grid layout for standard fields -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
          <div
            v-for="detail in details"
            :key="detail.label"
            class="flex items-start gap-1.5 min-w-0"
          >
            <span
              class="text-[10px] text-[var(--color-text-muted)] font-medium shrink-0 leading-tight"
            >
              {{ detail.label }}:
            </span>
            <span
              class="text-xs font-medium truncate leading-tight"
              :class="
                detail.value === '-'
                  ? 'text-[var(--color-text-muted)]'
                  : 'text-[var(--color-text)]'
              "
              :title="detail.value"
            >
              {{ detail.value }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

import { useHeightAnimation } from '~/composables/useHeightAnimation';
import { isSeparatorDetail, isTotalDetail } from '~/types/parceiro';

import type { Component } from 'vue';
import type { EnhancedDetail } from '~/types/parceiro';


export interface Detail {
  label: string;
  value: string;
}

interface Props {
  id?: string;
  title: string;
  subtitle?: string;
  icon: Component;
  iconClass?: string;
  iconContainerClass?: string;
  status?: string;
  statusVariant?: (status: string) => 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  details: EnhancedDetail[];
  initialVisibleDetails?: number;
  expandable?: boolean;
  rightLabel?: string;
  detailsLayout?: 'grid' | 'list';
}

const props = withDefaults(defineProps<Props>(), {
  id: () => `expandable-card-${Math.random().toString(36).substr(2, 9)}`,
  subtitle: '',
  iconClass: '',
  iconContainerClass: '',
  status: '',
  initialVisibleDetails: 2,
  expandable: true,
  rightLabel: '',
  detailsLayout: 'grid',
});

const isExpanded = ref(false);
const detailsContainer = ref<HTMLElement | null>(null);

// Animation helpers usando composable reutilizável
const { beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave } = useHeightAnimation();

const toggleExpand = () => {
  if (!props.expandable) return;
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 300ms ease-out;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
}
</style>
