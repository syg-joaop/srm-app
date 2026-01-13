<template>
  <UiCard
    :expandable="true"
    :title="title"
    :subtitle="subtitle"
    :icon="icon"
    :status="status"
    :status-variant="statusVariant"
    :details="details"
    :right-label="rightLabel"
    :details-layout="detailsLayout"
  />
</template>

<script setup lang="ts">
import UiCard from "./UiCard.vue";

import type { Component } from "vue";
import type { EnhancedDetail } from "~/types/parceiro";
import type { Variant } from "./UiBadge.vue";

interface Props {
  id?: string;
  title: string;
  subtitle?: string;
  icon: Component;
  iconClass?: string;
  iconContainerClass?: string;
  status?: string;
  statusVariant?: (status: string) => Variant;
  details: EnhancedDetail[];
  initialVisibleDetails?: number;
  expandable?: boolean;
  rightLabel?: string;
  detailsLayout?: "grid" | "list";
}

withDefaults(defineProps<Props>(), {
  id: () => `expandable-card-${Math.random().toString(36).substr(2, 9)}`,
  subtitle: "",
  iconClass: "",
  iconContainerClass: "",
  status: "",
  initialVisibleDetails: 2,
  expandable: true,
  rightLabel: "",
  detailsLayout: "grid",
});
</script>
