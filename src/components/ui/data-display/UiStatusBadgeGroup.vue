<template>
  <div class="flex gap-2 text-[10px] sm:text-xs justify-end">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="group/badge relative flex items-center justify-center gap-2 w-16 py-1.5 rounded border transition-all duration-200 ease-out cursor-pointer hover:scale-110 hover:z-20 hover:shadow-md"
      :class="getBadgeStyle(item.color)"
      @mouseenter="(e) => showTooltip(index, e)"
      @mouseleave="hideTooltip"
    >
      <component :is="getIcon(item.icon)" class="w-3.5 h-3.5 shrink-0" />
      <span class="font-medium">{{ item.value }}</span>

      <Teleport to="body">
        <div
          v-if="hoveredIndex === index"
          class="fixed px-2 py-1 text-[10px] font-medium text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]"
          :style="tooltipStyle"
        >
          {{ item.label }}
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"
          ></div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Calendar, CheckCircle, Clock, XCircle, Circle } from "lucide-vue-next";

interface StatusBadgeItem {
  value: string | number;
  label?: string;
  color: "red" | "green" | "yellow" | "blue" | "purple" | "gray" | "dark-red";
  icon?: string;
}

defineProps<{
  items: StatusBadgeItem[];
}>();

const hoveredIndex = ref<number | null>(null);
const tooltipStyle = ref<Record<string, string>>({});

const showTooltip = (index: number, event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  tooltipStyle.value = {
    top: `${rect.top - 8}px`,
    left: `${rect.left + rect.width / 2}px`,
    transform: "translate(-50%, -100%)",
  };

  hoveredIndex.value = index;
};

const hideTooltip = () => {
  hoveredIndex.value = null;
};

const getIcon = (iconName?: string) => {
  const icons: Record<string, any> = {
    calendar: Calendar,
    check: CheckCircle,
    clock: Clock,
    x: XCircle,
    default: Circle,
  };
  return icons[iconName || "default"] || Circle;
};

const getBadgeStyle = (color: string) => {
  const colorMap: Record<string, string> = {
    red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30",
    green:
      "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30",
    yellow:
      "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30",
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
    purple:
      "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30",
    gray: "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    "dark-red":
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800/50",
  };
  return colorMap[color] || colorMap.gray;
};
</script>
