<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="pb-5 text-2xl font-bold">coluninha retinha</h1>
    <UiCard :clickable="true">
      <p class="text-gray-600">
        Detalhes do fornecedor serão implementados aqui.
      </p>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });
import UiCard from "~/components/ui/layout/UiCard.vue";

const route = useRoute();
const id = computed(() => route.params.id);
</script>
