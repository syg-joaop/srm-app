<template>
  <UiList variant="simple">
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>
    <slot />
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
  </UiList>
</template>

<script setup lang="ts">
import UiList from "./UiList.vue";

defineOptions({ name: "UiListItem" });
</script>
