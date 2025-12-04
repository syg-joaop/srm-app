<template>
  <div
    class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-500 py-8"
  >
    <div
      class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800/50 flex items-center justify-center mb-3"
    >
      <component :is="icon" class="w-6 h-6 opacity-50" />
    </div>
    <p class="text-sm font-medium">{{ title }}</p>
    <p v-if="description" class="text-xs text-gray-400 dark:text-gray-600">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  title: string;
  description?: string;
}>();
</script>
