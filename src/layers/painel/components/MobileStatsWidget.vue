<template>
  <div
    class="relative overflow-hidden rounded-2xl shadow-xl"
    style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark, #0077be) 100%);"
  >
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5"></div>
      <div class="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5"></div>
      <div class="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/3"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 p-4">
      <!-- Header: Two main stats side by side -->
      <div class="flex justify-between items-start mb-4">
        <!-- Primary Stat (Fornecedores) -->
        <div v-if="stats[0]" class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg ring-1 ring-white/20">
            <component :is="getIcon(stats[0].icon)" :size="24" class="text-white" />
          </div>
          <div>
            <p class="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-0.5">
              {{ stats[0].label }}
            </p>
            <p class="text-2xl font-bold text-white tracking-tight">
              {{ stats[0].value }}
            </p>
          </div>
        </div>

        <!-- Secondary Stat (Prospectos) -->
        <div v-if="stats[1]" class="flex items-center gap-2.5 text-right">
          <div>
            <p class="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-0.5">
              {{ stats[1].label }}
            </p>
            <p class="text-xl font-bold text-white tracking-tight">
              {{ stats[1].value }}
            </p>
          </div>
          <div class="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg ring-1 ring-white/20">
            <component :is="getIcon(stats[1].icon)" :size="20" class="text-white" />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-white/20 mb-4"></div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-5 gap-1">
        <div
          v-for="stat in gridStats"
          :key="stat.label"
          class="flex flex-col items-center text-center py-2 px-1 rounded-xl transition-all duration-200 hover:bg-white/10"
        >
          <!-- Icon -->
          <div class="mb-1.5 p-1.5 rounded-lg bg-white/15 backdrop-blur-sm">
            <component :is="getIcon(stat.icon)" :size="16" class="text-white" />
          </div>

          <!-- Value -->
          <span class="text-sm font-bold text-white leading-tight mb-0.5">
            {{ stat.value }}
          </span>

          <!-- Label -->
          <span class="text-[8px] font-medium text-white/60 uppercase tracking-wide leading-tight truncate w-full">
            {{ formatLabel(stat.label) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Subtle shine effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
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

// Format label to be shorter for mobile
const formatLabel = (label?: string) => {
  if (!label) return ''
  // Shorten common labels
  const shortLabels: Record<string, string> = {
    'Atendimentos': 'Atend.',
    'Agendados': 'Agend.',
    'Fornecedores': 'Fornec.',
    'Prospectos': 'Prosp.',
  }
  return shortLabels[label] || label
}
</script>
