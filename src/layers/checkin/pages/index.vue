<template>
  <div
    class="min-h-screen p-4 sm:p-6"
    style="background-color: var(--color-background); color: var(--color-text)"
  >
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Check-in</h1>
    <AvisoEmConstrucao />
  </div>
</template>

<script setup lang="ts">
import AvisoEmConstrucao from "~/components/common/AvisoEmConstrucao.vue";

definePageMeta({ layout: "default" });
</script>
