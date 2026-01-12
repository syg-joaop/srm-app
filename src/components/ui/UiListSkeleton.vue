<template>
  <div class="space-y-2" aria-hidden="true">
    <div
      v-for="i in count"
      :key="`skeleton-${i}`"
      class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 relative overflow-hidden"
    >
      <!-- Shimmer effect -->
      <div
        class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style="background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)"
      />

      <div class="grid grid-cols-12 gap-4 items-center">
        <!-- Icon + Title area -->
        <div :class="[`col-span-${columns.title || 5}`]" class="space-y-2">
          <div class="flex items-center gap-3">
            <div
              v-if="showIcon"
              class="h-9 w-9 bg-[var(--color-hover)] rounded-md animate-pulse flex-shrink-0"
            />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-2/3 bg-[var(--color-hover)] rounded animate-pulse" />
              <div class="h-3 w-1/2 bg-[var(--color-hover)] rounded animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Progress area -->
        <div
          v-if="showProgress"
          :class="[`col-span-${columns.progress || 2}`]"
          class="flex justify-center"
        >
          <div class="h-2 w-24 bg-[var(--color-hover)] rounded-full animate-pulse" />
        </div>

        <!-- Status area -->
        <div
          v-if="showStatus"
          :class="[`col-span-${columns.status || 2}`]"
          class="flex justify-center"
        >
          <div class="h-5 w-16 bg-[var(--color-hover)] rounded-full animate-pulse" />
        </div>

        <!-- Extra columns -->
        <div
          v-for="(col, index) in extraColumns"
          :key="`col-${index}`"
          :class="[`col-span-${col.span || 2}`]"
          class="flex"
          :style="{ justifyContent: col.align || 'flex-start' }"
        >
          <div
            class="bg-[var(--color-hover)] rounded animate-pulse"
            :style="{
              height: col.height || '14px',
              width: col.width || '80%',
            }"
          />
        </div>

        <!-- Actions area -->
        <div :class="[`col-span-${columns.actions || 3}`]" class="flex justify-end gap-2">
          <div class="h-8 w-8 bg-[var(--color-hover)] rounded animate-pulse" />
          <div v-if="showSecondAction" class="h-8 w-8 bg-[var(--color-hover)] rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnConfig {
  title?: number;
  progress?: number;
  status?: number;
  actions?: number;
}

interface ExtraColumn {
  span?: number;
  width?: string;
  height?: string;
  align?: "flex-start" | "center" | "flex-end";
}

interface Props {
  count?: number;
  showIcon?: boolean;
  showProgress?: boolean;
  showStatus?: boolean;
  showSecondAction?: boolean;
  columns?: ColumnConfig;
  extraColumns?: ExtraColumn[];
}

withDefaults(defineProps<Props>(), {
  count: 5,
  showIcon: true,
  showProgress: true,
  showStatus: true,
  showSecondAction: true,
  columns: () => ({}),
  extraColumns: () => [],
});

defineOptions({ name: "UiListSkeleton" });
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
