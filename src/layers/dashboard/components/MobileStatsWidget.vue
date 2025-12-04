<template>
  <div
    class="relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 group"
    style="background-color: var(--color-surface); border: 1px solid var(--color-border);"
  >
    <!-- Header Section: Primary Stats -->
    <div class="relative z-10 flex justify-between items-end mb-8 pt-2">
      <!-- Total -->
      <div v-if="stats[0]" class="flex flex-col">
        <span class="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1" style="color: var(--color-text)">
          {{ stats[0].label }}
        </span>
        <span class="text-4xl font-black tracking-tighter leading-none" style="color: var(--color-primary)">
          {{ stats[0].value }}
        </span>
      </div>

      <!-- Active (Secondary Highlight) -->
      <div v-if="stats[1]" class="flex flex-col items-end">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
          <span class="text-[10px] uppercase tracking-widest font-bold opacity-60" style="color: var(--color-text)">
            {{ stats[1].label }}
          </span>
        </div>
        <span class="text-2xl font-bold tracking-tight" style="color: var(--color-text)">
          {{ stats[1].value }}
        </span>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px w-full mb-6 opacity-10" style="background-color: var(--color-text)"></div>

    <!-- Grid Section: Secondary Stats -->
    <div class="relative z-10 grid grid-cols-3 gap-y-6 gap-x-2">
      <div
        v-for="stat in gridStats"
        :key="stat.label"
        class="flex flex-col items-center text-center group/item"
      >
        <!-- Icon Container -->
        <div
          class="mb-2 p-2.5 rounded-xl transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-lg group-hover/item:bg-[var(--color-primary)] group-hover/item:text-white"
          style="background-color: var(--color-background); color: var(--color-primary); border: 1px solid var(--color-border-subtle);"
        >
          <component :is="getIcon(stat.icon)" :size="20" stroke-width="2.5" />
        </div>

        <!-- Value -->
        <span class="text-sm font-bold leading-tight mb-0.5" style="color: var(--color-text)">
          {{ stat.value }}
        </span>

        <!-- Label -->
        <span class="text-[9px] font-medium opacity-50 leading-tight" style="color: var(--color-text)">
          {{ stat.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface StatItem {
  label?: string
  value?: string | number
  icon?: string
  color?: string
}

const props = defineProps<{
  stats: StatItem[]
}>()

// Use the rest of the stats for the grid (skipping the first 2 which are in the header)
const gridStats = computed(() => {
  return props.stats.slice(2)
})

const getIcon = (iconName?: string) => {
  if (!iconName) return LucideIcons.HelpCircle
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
}
</script>
