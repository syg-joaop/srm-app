<template>
  <div class="relative bg-[var(--color-surface)] md:rounded-none rounded-lg border border-[var(--color-border-subtle)] md:border-[var(--color-border)] md:border-t-0 first:md:border-t px-3 py-2.5 md:px-6 md:py-3 overflow-hidden">
    <!-- Skeleton shimmer effect -->
    <div
      class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
      style="background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)"
    />

    <div class="flex md:grid md:grid-cols-12 gap-2.5 md:gap-4 items-center">
      <!-- Descrição Skeleton -->
      <div class="col-span-5 flex items-center gap-2.5 md:gap-3 flex-1 min-w-0">
        <div
          class="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--color-border)] animate-pulse"
        />
        <div class="flex flex-col min-w-0 flex-1">
          <div
            class="h-4 bg-[var(--color-border)] rounded animate-pulse mb-1.5"
            style="width: 50%; animation-delay: 0ms"
          />
          <div
            class="h-3 bg-[var(--color-border)] rounded animate-pulse"
            style="width: 65%; animation-delay: 100ms"
          />
          <div
            class="h-3 bg-[var(--color-border)] rounded animate-pulse mt-1 hidden sm:block"
            style="width: 45%; animation-delay: 150ms"
          />
        </div>
      </div>

      <!-- Progresso Skeleton -->
      <div class="hidden md:flex col-span-2 justify-center">
        <div class="flex items-center gap-2">
          <div
            class="w-16 h-1.5 bg-[var(--color-border)] rounded-full animate-pulse"
            style="animation-delay: 200ms"
          />
          <div
            class="h-3 bg-[var(--color-border)] rounded animate-pulse"
            style="width: 30px; animation-delay: 250ms"
          />
        </div>
      </div>

      <!-- Status Skeleton -->
      <div class="hidden md:flex col-span-2 justify-center">
        <div
          class="h-5 bg-[var(--color-border)] rounded-full animate-pulse"
          style="width: 70px; animation-delay: 300ms"
        />
      </div>

      <!-- Ações Skeleton -->
      <div class="col-span-3 flex items-center justify-end gap-1.5 md:gap-2">
        <div
          class="h-8 bg-[var(--color-border)] rounded animate-pulse hidden md:block"
          style="width: 100px; animation-delay: 350ms"
        />
        <div
          class="h-8 bg-[var(--color-border)] rounded animate-pulse"
          style="width: 80px; animation-delay: 400ms"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "RotaCardSkeleton",
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
