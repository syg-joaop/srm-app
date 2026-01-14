<template>
  <!-- Variant: expandable (UiExpandableCard style) -->
  <article
    v-if="expandable"
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
      <component v-if="icon" :is="icon" class="w-4 h-4 text-[var(--color-primary)] shrink-0" />

      <!-- Title & Status & Right Label -->
      <div class="flex-1 min-w-0 flex items-center justify-between gap-2">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-[var(--color-text)] truncate" :title="title">
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
        v-if="expandable && details && details.length > 0"
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
        v-if="isExpanded && details && details.length > 0"
        ref="detailsContainer"
        class="overflow-hidden mt-3"
      >
        <!-- List layout for items with long labels (like products list) -->
        <div v-if="detailsLayout === 'list'" class="space-y-2">
          <div
            v-for="detail in details"
            :key="detail.label"
            class="py-2 rounded"
            :class="
              isSeparatorDetail(detail)
                ? 'border-t border-[var(--color-border)] pt-4 mt-2'
                : isTotalDetail(detail)
                  ? 'bg-[var(--color-hover)] px-3 mt-2'
                  : 'pl-3'
            "
          >
            <p
              v-if="!isSeparatorDetail(detail)"
              class="text-xs font-semibold mb-1"
              :class="
                isTotalDetail(detail) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
              "
            >
              {{ detail.label }}
            </p>
            <p
              v-if="!isSeparatorDetail(detail)"
              class="text-xs"
              :class="
                isTotalDetail(detail)
                  ? 'text-[var(--color-text)] font-medium'
                  : 'text-[var(--color-text-muted)]'
              "
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
                detail.value === '-' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'
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

  <!-- Variant: default (card básico) -->
  <div
    v-else
    :class="['base-card', { 'is-hoverable': hoverable, 'is-clickable': clickable }]"
    @click="handleClick"
  >
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="card-body" :style="{ padding: noPadding ? '0' : undefined }">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import { ref } from "vue";

import { isSeparatorDetail, isTotalDetail } from "./ui.types";

import UiBadge from "./UiBadge.vue";

import type { Component } from "vue";
import type { EnhancedDetail } from "./ui.types";
import type { Variant } from "./UiBadge.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    hoverable?: boolean;
    clickable?: boolean;
    noPadding?: boolean;
    expandable?: boolean;
    subtitle?: string;
    icon?: Component;
    status?: string;
    statusVariant?: (status: string) => Variant;
    details?: EnhancedDetail[];
    rightLabel?: string;
    detailsLayout?: "grid" | "list";
  }>(),
  {
    title: "",
    hoverable: false,
    clickable: false,
    noPadding: false,
    expandable: false,
    subtitle: "",
    rightLabel: "",
    detailsLayout: "grid",
  },
);

defineOptions({ name: "UiCard" });

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isExpanded = ref(false);
const detailsContainer = ref<HTMLElement | null>(null);

// Animação de altura inline
const beforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = "0";
  htmlEl.style.opacity = "0";
};

const enter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = "height 250ms ease-out, opacity 250ms ease-out";
  requestAnimationFrame(() => {
    htmlEl.style.height = htmlEl.scrollHeight + "px";
    htmlEl.style.opacity = "1";
  });
};

const afterEnter = (el: Element) => {
  (el as HTMLElement).style.height = "auto";
};

const beforeLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = htmlEl.scrollHeight + "px";
  htmlEl.style.opacity = "1";
};

const leave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.transition = "height 250ms ease-out, opacity 250ms ease-out";
  requestAnimationFrame(() => {
    htmlEl.style.height = "0";
    htmlEl.style.opacity = "0";
  });
};

const afterLeave = (el: Element) => {
  (el as HTMLElement).style.height = "auto";
};

const toggleExpand = () => {
  if (!props.expandable) return;
  isExpanded.value = !isExpanded.value;
};

const handleClick = (event: MouseEvent) => {
  if (!props.clickable) return;
  emit("click", event);
};
</script>

<style scoped>
.base-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.is-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:hover {
  border-color: var(--color-primary);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

/* Expandable card styles */
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
