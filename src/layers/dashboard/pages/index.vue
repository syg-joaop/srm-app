<template>
  <div
    class="dashboard-page min-h-screen text-gray-900 dark:text-white p-6"
    style="
      background-color: var(--color-background);
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    "
  >
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>

    <div v-else class="space-y-6">
      <MobileStatsWidget :stats="stats" class="lg:hidden mb-6" />

      <div
        class="hidden lg:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
      >
        <StatCard
          v-for="stat in stats"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Compras</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWidget title="Compras do mês">
            <div class="flex flex-col h-full">
              <UiMetricHero
                :icon="DollarSign"
                label="Total Bruto"
                :value="comprasMes[0]?.value"
                variant="primary"
              />
              <UiMetricGrid :items="comprasMes.slice(1)" />
            </div>
          </DashboardWidget>

          <DashboardWidget title="Compras mês anterior">
            <div class="flex flex-col h-full">
              <UiMetricHero
                :icon="CalendarClock"
                label="Total Anterior"
                :value="comprasMesAnterior[0]?.value"
                variant="primary"
              />
              <UiMetricGrid :items="comprasMesAnterior.slice(1)" />
            </div>
          </DashboardWidget>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Atendimentos</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWidget
            class="!h-[470px]"
            title="Próximos atendimentos"
            subtitle="Ocorrências com data de próximo atendimento"
          >
            <UiEmptyState
              :icon="Search"
              title="Sem agendamentos"
              description="Não existem atendimentos agendados"
            />
          </DashboardWidget>

          <DashboardWidget
            class="!h-[470px]"
            title="Atendimentos vencidos"
            subtitle="Ocorrências abertas com data vencida"
            :items="atendimentosVencidos"
            :paginated="true"
            :page-size="6"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-2">
                <DashboardListItem
                  v-for="item in paginatedItems"
                  :key="item.sr_recno"
                >
                  <template #leading>
                    <DateBox label="VENC" variant="danger">{{
                      item.data_oco.substring(0, 2)
                    }}</DateBox>
                  </template>

                  <div class="flex justify-between items-start">
                    <p
                      class="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate pr-2 group-hover/item:text-red-600 dark:group-hover/item:text-red-400 transition-colors"
                    >
                      {{ item.apelido }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2 mt-0.5">
                    <span
                      class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]"
                      >{{ item.empresa }}</span
                    >
                  </div>

                  <template #action>
                    <div class="flex gap-1">
                      <button
                        class="p-1.5 hover:bg-white dark:hover:bg-gray-800 text-primary rounded-full shadow-sm transition-colors"
                        title="Ver detalhes"
                      >
                        <List class="w-3.5 h-3.5" />
                      </button>
                      <button
                        class="p-1.5 hover:bg-white dark:hover:bg-gray-800 text-green-500 rounded-full shadow-sm transition-colors"
                        title="Resolver"
                      >
                        <CheckSquare class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </template>
                </DashboardListItem>
              </div>
            </template>
          </DashboardWidget>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Relatórios</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardWidget
            class="!h-[450px]"
            title="Ocorrências"
            subtitle="Dos últimos 12 meses por status"
          >
            <template #action>
              <span class="text-xl font-bold text-white">101</span>
            </template>

            <div ref="pieChartRef" class="w-full h-full min-h-[250px]"></div>
            <UiChartLegend
              :items="[
                { value: 24, label: 'Finalizado', color: 'green' },
                { value: 27, label: 'Acompanhando', color: 'yellow' },
                { value: 46, label: 'Pendentes', color: 'red' },
              ]"
            />
          </DashboardWidget>

          <DashboardWidget
            class="!h-[450px]"
            title="Ocorrências"
            subtitle="Quantidade por mês nos últimos 6 meses"
          >
            <div ref="lineChartRef" class="w-full h-full min-h-[250px]"></div>
          </DashboardWidget>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardWidget
            class="h-[450px]"
            title="Meta diária"
            subtitle="Por KG"
          >
            <div ref="barChartRef" class="w-full h-full min-h-[250px]"></div>
          </DashboardWidget>

          <DashboardWidget
            class="!h-[450px]"
            title="Compras X Comprador"
            subtitle="Quantidade por mês nos últimos 6 meses"
            :items="compradorItems"
            :paginated="true"
            :page-size="6"
          >
            <template #default="{ paginatedItems }">
              <div class="-mx-5">
                <table class="w-full table-fixed text-sm text-left">
                  <thead
                    class="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent border-b border-gray-200 dark:border-gray-800"
                  >
                    <tr>
                      <th class="px-5 py-3 font-semibold">Comprador</th>
                      <th class="px-5 py-3 font-semibold text-center">
                        Mês atual
                      </th>
                      <th class="px-5 py-3 font-semibold text-center">
                        Mês anterior
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in paginatedItems"
                      :key="item.name"
                      class="border-b border-gray-200 dark:border-gray-800/50 hover:bg-gradient-to-r hover:from-primary/5 hover:via-primary/3 hover:to-transparent transition-all duration-300 group"
                    >
                      <td
                        class="px-5 py-3 font-medium text-gray-800 dark:text-gray-300 truncate group-hover:text-primary transition-colors"
                      >
                        {{ item.name }}
                      </td>
                      <td class="px-5 py-3 text-center">
                        <span
                          class="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold text-xs border border-green-200 dark:border-green-800/50"
                        >
                          {{ item.current }}
                        </span>
                      </td>
                      <td
                        class="px-5 py-3 text-center text-gray-600 dark:text-gray-400 font-medium"
                      >
                        {{ item.previous }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </DashboardWidget>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardWidget
            class="!h-[520px]"
            title="Produtos mais comprados"
            subtitle="Comparativo Mensal"
          >
            <div
              ref="productChartRef"
              class="w-full h-full min-h-[250px]"
            ></div>
          </DashboardWidget>

          <DashboardWidget
            class="h-[520px]"
            title="Total de descontos"
            subtitle="Por KG"
          >
            <div
              ref="discountChartRef"
              class="w-full h-full min-h-[250px]"
            ></div>
          </DashboardWidget>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardWidget
            class="!h-[505px]"
            title="Aniversariantes"
            subtitle="Contatos com aniversário próximo"
            :items="aniversariantesItems"
            :paginated="true"
            :page-size="6"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-2">
                <DashboardListItem
                  v-for="item in paginatedItems"
                  :key="item.name"
                >
                  <template #leading>
                    <DateBox label="DIA">{{ item.date.split("/")[0] }}</DateBox>
                  </template>

                  <div class="flex justify-between items-start">
                    <p
                      class="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate pr-2 group-hover/item:text-primary-dark dark:group-hover/item:text-primary transition-colors"
                    >
                      {{ item.name }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2 mt-0.5">
                    <span
                      class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]"
                      >{{ item.location }}</span
                    >
                    <span
                      class="hidden sm:block w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600"
                    ></span>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                    >
                      {{ item.status }}
                    </span>
                  </div>

                  <template #action>
                    <button
                      class="p-1.5 hover:bg-white dark:hover:bg-gray-800 text-primary rounded-full shadow-sm"
                      title="Enviar felicitações"
                    >
                      <Gift class="w-3.5 h-3.5" />
                    </button>
                  </template>
                </DashboardListItem>
              </div>
            </template>
          </DashboardWidget>

          <DashboardWidget
            class="!h-[505px]"
            title="Atendentes"
            subtitle="Atendimentos por usuários"
            :items="atendentesItems"
            :paginated="true"
            :page-size="6"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-2">
                <DashboardListItem
                  v-for="(item, idx) in paginatedItems"
                  :key="idx"
                >
                  <template #leading>
                    <div class="flex items-center gap-2">
                      <span
                        class="font-medium text-sm text-gray-800 dark:text-gray-200"
                      >
                        {{ item.role }}
                      </span>
                    </div>
                  </template>
                  <UiStatusBadgeGroup :items="item.statuses" />
                </DashboardListItem>
              </div>
            </template>
          </DashboardWidget>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CalendarClock,
  Search,
  List,
  CheckSquare,
  DollarSign,
  Gift,
} from "lucide-vue-next";
import * as echarts from "echarts";
import StatCard from "../components/StatCard.vue";
import MobileStatsWidget from "../components/MobileStatsWidget.vue";
import DashboardWidget from "../components/DashboardWidget.vue";
import DashboardListItem from "@/components/ui/DashboardListItem.vue";
import DateBox from "@/components/ui/DateBox.vue";
import UiMetricHero from "@/components/ui/data-display/UiMetricHero.vue";
import UiMetricGrid from "@/components/ui/data-display/UiMetricGrid.vue";
import UiEmptyState from "@/components/ui/feedback/UiEmptyState.vue";
import UiChartLegend from "@/components/ui/data-display/UiChartLegend.vue";
import UiStatusBadgeGroup from "@/components/ui/data-display/UiStatusBadgeGroup.vue";

definePageMeta({
  layout: "default",
});

const { fetchDashboard } = useDashboardService();

const filters = ref({
  data_inicial: "2025-11-01",
  data_final: "2025-11-30",
  data_inicial2: "2025-10-01",
  data_final2: "2025-10-31",
  categoriaFornecedor: "0",
  filial: "TODAS",
  mes_grafico: "atual",
});

const { data, status } = await fetchDashboard(filters);
const isLoading = computed(() => status.value === "pending");

const dashboardStore = useDashboardStore();
const {
  stats,
  comprasMes,
  comprasMesAnterior,
  compradorItems,
  aniversariantesItems,
  atendentesItems,
  chartData,
  atendimentosVencidos,
} = storeToRefs(dashboardStore);

const pieChartRef = ref<HTMLElement | null>(null);
const lineChartRef = ref<HTMLElement | null>(null);
const barChartRef = ref<HTMLElement | null>(null);
const discountChartRef = ref<HTMLElement | null>(null);
const productChartRef = ref<HTMLElement | null>(null);

const initCharts = () => {
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value);
    chart.setOption({
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#1e293b",
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: "bold" } },
          data: chartData.value.ocorrenciasPie,
        },
      ],
    });
  }

  if (lineChartRef.value) {
    const chart = echarts.init(lineChartRef.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.value.ocorrenciasLine.months,
      },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "#334155" } } },
      series: [
        {
          data: chartData.value.ocorrenciasLine.values,
          type: "line",
          smooth: true,
          areaStyle: { opacity: 0.1 },
          itemStyle: { color: "#0099ff" },
        },
      ],
    });
  }

  if (barChartRef.value) {
    const chart = echarts.init(barChartRef.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: { type: "category", data: chartData.value.metaDiaria.days },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "#334155" } } },
      series: [
        {
          data: chartData.value.metaDiaria.values,
          type: "bar",
          itemStyle: { color: "#0099ff" },
        },
      ],
    });
  }

  if (discountChartRef.value) {
    const chart = echarts.init(discountChartRef.value);
    chart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: { type: "category", data: chartData.value.descontos.months },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "#334155" } } },
      series: [
        {
          data: chartData.value.descontos.values,
          type: "bar",
          barWidth: "20%",
          itemStyle: { color: "#0099ff" },
        },
      ],
    });
  }

  if (productChartRef.value) {
    const chart = echarts.init(productChartRef.value);
    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
          let result = `<div class="font-bold mb-1">${params[0].name}</div>`;
          params.forEach((item: any) => {
            const value = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.value);
            result += `
              <div class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 rounded-full " style="background-color: ${item.color} "></span>
                <span class="font-medium">${item.seriesName}:</span>
                <span class="font-medium">${value}</span>
              </div>
            `;
          });
          return result;
        },
      },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: "#94a3b8" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        splitLine: {
          lineStyle: { color: "#334155", type: "dashed", opacity: 0.3 },
        },
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          },
          color: "#94a3b8",
        },
      },
      yAxis: {
        type: "category",
        data: chartData.value.produtosBar.names,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          width: 100,
          overflow: "truncate",
          color: "#94a3b8",
        },
      },
      series: [
        {
          name: "Mês Atual",
          type: "bar",
          data: chartData.value.produtosBar.current,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#0099ff" },
              { offset: 1, color: "#0077be" },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
          barGap: "20%",
          barCategoryGap: "40%",
        },
        {
          name: "Mês Anterior",
          type: "bar",
          data: chartData.value.produtosBar.previous,
          itemStyle: {
            color: "#94a3b8",
            borderRadius: [0, 4, 4, 0],
            opacity: 0.5,
          },
        },
      ],
    });
  }
};

watch(
  data,
  (newData) => {
    if (newData) {
      dashboardStore.setDashboardData(newData);
      nextTick(() => {
        initCharts();
      });
    }
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  echarts.getInstanceByDom(pieChartRef.value!)?.resize();
  echarts.getInstanceByDom(lineChartRef.value!)?.resize();
  echarts.getInstanceByDom(barChartRef.value!)?.resize();
  echarts.getInstanceByDom(discountChartRef.value!)?.resize();
  echarts.getInstanceByDom(productChartRef.value!)?.resize();
};
</script>

<style scoped></style>
