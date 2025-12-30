<template>
  <div class="space-y-3">
    <article
      v-for="index in count"
      :key="index"
      class="relative rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <!-- Skeleton shimmer effect -->
      <div
        class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style="background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)"
      />

      <!-- Icon Skeleton -->
      <div class="flex items-start gap-4">
        <div
          class="flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-[var(--color-border)] animate-pulse"
        />

        <!-- Content Skeleton -->
        <div class="flex-1 min-w-0">
          <!-- Title and Status Skeletons -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <!-- Title -->
              <div
                class="h-5 bg-[var(--color-border)] rounded animate-pulse mb-2"
                style="width: 60%"
              />
              <!-- Subtitle -->
              <div
                class="h-4 bg-[var(--color-border)] rounded animate-pulse"
                style="width: 40%"
              />
            </div>
            <!-- Status Badge Skeleton -->
            <div
              class="h-6 w-16 bg-[var(--color-border)] rounded-full animate-pulse shrink-0"
            />
          </div>

          <!-- Details Grid Skeleton -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <div v-for="i in 4" :key="i" class="flex items-start gap-2">
              <!-- Label Skeleton -->
              <div
                class="h-3 bg-[var(--color-border)] rounded animate-pulse shrink-0"
                style="width: 80px"
              />
              <!-- Value Skeleton -->
              <div
                class="h-3.5 bg-[var(--color-border)] rounded animate-pulse flex-1"
                style="animation-delay: `${i * 100}ms`"
              />
            </div>
          </div>

          <!-- Expand Button Skeleton -->
          <div
            class="mt-3 h-5 bg-[var(--color-border)] rounded animate-pulse"
            style="width: 100px"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 3,
});
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

/* Staggered animation delays for skeleton items */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
