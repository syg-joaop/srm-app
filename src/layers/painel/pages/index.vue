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
          <DashboardWidget title="Compras do mês" class="pt-2 pb-2">
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
            :empty-icon="AlertCircle"
            empty-title="Nenhum atendimento vencido"
            empty-description="Não existem atendimentos com data vencida"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-2">
                <DashboardListItem
                  v-for="item in paginatedItems"
                  :key="item.sr_recno"
                  class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  @click="handleOpenAtendimentoModal(item)"
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
            :is-empty="isOcorrenciasPieEmpty"
            :empty-icon="PieChart"
            empty-title="Sem ocorrências"
            empty-description="Não há ocorrências no período"
          >
            <template #action>
              <div class="flex flex-col items-end">
                <span
                  class="text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400"
                  >Total</span
                >
                <span class="text-2xl font-bold text-primary">{{
                  totalOcorrencias
                }}</span>
              </div>
            </template>

            <div ref="pieChartRef" class="w-full h-full min-h-[250px]"></div>
          </DashboardWidget>

          <DashboardWidget
            class="!h-[450px]"
            title="Ocorrências"
            subtitle="Quantidade por mês nos últimos 6 meses"
            :is-empty="isOcorrenciasLineEmpty"
            :empty-icon="LineChart"
            empty-title="Sem ocorrências"
            empty-description="Não há ocorrências nos últimos 6 meses"
          >
            <div ref="lineChartRef" class="w-full h-full min-h-[250px]"></div>
          </DashboardWidget>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardWidget
            class="h-[450px]"
            title="Meta diária"
            subtitle="Por KG"
            :is-empty="isMetaDiariaEmpty"
            :empty-icon="Target"
            empty-title="Sem dados de meta"
            empty-description="Não há dados de meta diária disponíveis"
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
            :empty-icon="ShoppingCart"
            empty-title="Nenhuma compra registrada"
            empty-description="Não existem compras no período selecionado"
          >
            <template #default="{ paginatedItems }">
              <div class="-mx-6">
                <table class="w-full table-fixed text-sm text-left">
                  <thead
                    class="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
                  >
                    <tr>
                      <th class="px-6 py-3 font-semibold tracking-wider">
                        Comprador
                      </th>
                      <th
                        class="px-6 py-3 font-semibold text-center tracking-wider"
                      >
                        Mês atual
                      </th>
                      <th
                        class="px-6 py-3 font-semibold text-center tracking-wider"
                      >
                        Mês anterior
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in paginatedItems"
                      :key="item.name"
                      class="border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 group/row"
                    >
                      <td
                        class="px-6 py-3 font-medium text-gray-700 dark:text-gray-300 truncate group-hover/row:text-primary transition-colors"
                      >
                        {{ item.name }}
                      </td>
                      <td class="px-6 py-3 text-center">
                        <span
                          class="font-bold text-xs text-green-600 dark:text-green-400"
                        >
                          {{ item.current }}
                        </span>
                      </td>
                      <td
                        class="px-6 py-3 text-center text-gray-500 dark:text-gray-400 font-medium text-xs"
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
            :is-empty="isProdutosBarEmpty"
            :empty-icon="Package"
            empty-title="Sem produtos"
            empty-description="Não há dados de produtos comprados"
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
            :is-empty="isDescontosEmpty"
            :empty-icon="Percent"
            empty-title="Sem descontos"
            empty-description="Não há dados de descontos disponíveis"
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
            :empty-icon="Cake"
            empty-title="Nenhum aniversariante"
            empty-description="Não há aniversariantes próximos"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-2">
                <DashboardListItem
                  v-for="item in paginatedItems"
                  :key="item.name"
                  @click="handleOpenParceiroModal(item)"
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
            :empty-icon="Users"
            empty-title="Nenhum atendente"
            empty-description="Não há dados de atendentes disponíveis"
          >
            <template #default="{ paginatedItems }">
              <div class="space-y-3">
                <DashboardListItem
                  v-for="(item, idx) in paginatedItems"
                  :key="idx"
                  class="min-h-[60px]"
                  @click="handleOpenAtendenteModal(item)"
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

    <ModalDetalhesParceiro
      v-model="showParceiroModal"
      :parceiro="parceiroSelecionado"
      :variant="modalVariant"
    />

    <ModalAtendimento
      v-model="showAtendimentoModal"
      :atendimento="atendimentoSelecionado"
    />
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
  AlertCircle,
  ShoppingCart,
  Cake,
  Users,
  PieChart,
  LineChart,
  Target,
  Percent,
  Package,
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
import UiStatusBadgeGroup from "@/components/ui/data-display/UiStatusBadgeGroup.vue";
import ModalDetalhesParceiro from "../components/ModalDetalhesParceiro.vue";
import ModalAtendimento from "@/components/common/ModalAtendimento.vue";
import {
  getPremiumTooltip,
  premiumTooltipStyle,
} from "@/utils/formatters/chart";
import { formatarKg, formatarMoeda } from "~/utils/formatters/formatadores";

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
  isOcorrenciasPieEmpty,
  isOcorrenciasLineEmpty,
  isMetaDiariaEmpty,
  isDescontosEmpty,
  isProdutosBarEmpty,
} = storeToRefs(dashboardStore);

const showParceiroModal = ref(false);
const parceiroSelecionado = ref(null);
const modalVariant = ref("parceiro");

const showAtendimentoModal = ref(false);
const atendimentoSelecionado = ref(null);

const handleOpenAtendimentoModal = (atendimento: any) => {
  atendimentoSelecionado.value = atendimento;
  showAtendimentoModal.value = true;
};

const handleOpenParceiroModal = (parceiro: any) => {
  modalVariant.value = "parceiro";
  parceiroSelecionado.value = parceiro;
  showParceiroModal.value = true;
};

const handleOpenAtendenteModal = (atendente: any) => {
  modalVariant.value = "atendente";
  parceiroSelecionado.value = {
    ...atendente,
    name: atendente.role,
  };
  showParceiroModal.value = true;
};

const totalOcorrencias = computed(() => {
  return chartData.value.ocorrenciasPie.reduce(
    (acc: number, item: any) => acc + item.value,
    0
  );
});

const pieChartRef = ref<HTMLElement | null>(null);
const lineChartRef = ref<HTMLElement | null>(null);
const barChartRef = ref<HTMLElement | null>(null);
const discountChartRef = ref<HTMLElement | null>(null);
const productChartRef = ref<HTMLElement | null>(null);

const initCharts = () => {
  const getStyle = (variable: string) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();

  if (pieChartRef.value) {
    const chart =
      echarts.getInstanceByDom(pieChartRef.value) ||
      echarts.init(pieChartRef.value);

    const coloredData = chartData.value.ocorrenciasPie.map((item) => {
      let colorVar = "--color-status-finalizado";
      switch (item.name) {
        case "Finalizado":
          colorVar = "--color-status-finalizado";
          break;
        case "Em Acompanhamento":
          colorVar = "--color-status-acompanhamento";
          break;
        case "Pendente":
          colorVar = "--color-status-pendente";
          break;
        case "Vencido":
          colorVar = "--color-status-vencido";
          break;
      }
      return {
        ...item,
        itemStyle: { color: getStyle(colorVar) },
      };
    });

    chart.setOption({
      baseOption: {
        tooltip: {
          trigger: "item",
          ...premiumTooltipStyle,
          formatter: (params: any) => getPremiumTooltip(params),
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: getStyle("--color-surface"),
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c}",
              color: "inherit",
            },
            labelLine: {
              show: true,
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            data: coloredData,
            radius: ["40%", "70%"],
          },
        ],
      },
      media: [
        {
          query: {
            maxWidth: 768,
          },
          option: {
            series: [
              {
                radius: ["25%", "50%"],
                label: {
                  fontSize: 10,
                  lineHeight: 14,
                },
                labelLine: {
                  length: 5,
                  length2: 5,
                },
              },
            ],
          },
        },
      ],
    });
  }

  const commonOptions = {
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      axisLine: { lineStyle: { color: getStyle("--color-border") } },
      axisLabel: { color: getStyle("--color-text-muted") },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: getStyle("--color-border"),
          type: "dashed",
          opacity: 0.3,
        },
      },
      axisLabel: { color: getStyle("--color-text-muted") },
    },
  };

  if (lineChartRef.value) {
    const chart =
      echarts.getInstanceByDom(lineChartRef.value) ||
      echarts.init(lineChartRef.value);
    chart.setOption({
      tooltip: {
        trigger: "axis",
        ...premiumTooltipStyle,
        formatter: (params: any) => getPremiumTooltip(params),
      },
      grid: commonOptions.grid,
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: chartData.value.ocorrenciasLine.months,
        ...commonOptions.xAxis,
      },
      yAxis: {
        type: "value",
        ...commonOptions.yAxis,
      },
      series: [
        {
          name: "Ocorrências",
          data: chartData.value.ocorrenciasLine.values,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#0099ff", borderColor: "#fff", borderWidth: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0, 153, 255, 0.3)" },
              { offset: 1, color: "rgba(0, 153, 255, 0)" },
            ]),
          },
        },
      ],
    });
  }

  if (barChartRef.value) {
    const chart =
      echarts.getInstanceByDom(barChartRef.value) ||
      echarts.init(barChartRef.value);
    chart.setOption({
      tooltip: {
        trigger: "axis",
        ...premiumTooltipStyle,
        formatter: (params: any) =>
          getPremiumTooltip(params, undefined, formatarKg),
      },
      grid: commonOptions.grid,
      xAxis: {
        type: "category",
        data: chartData.value.metaDiaria.days,
        ...commonOptions.xAxis,
      },
      yAxis: {
        type: "value",
        ...commonOptions.yAxis,
      },
      series: [
        {
          name: "Meta Diária: ",
          data: chartData.value.metaDiaria.values,
          type: "bar",
          itemStyle: { color: "#0099ff" },
        },
      ],
    });
  }

  if (discountChartRef.value) {
    const chart =
      echarts.getInstanceByDom(discountChartRef.value) ||
      echarts.init(discountChartRef.value);
    chart.setOption({
      tooltip: {
        trigger: "axis",
        ...premiumTooltipStyle,
        formatter: (params: any) =>
          getPremiumTooltip(params, undefined, formatarMoeda),
      },
      grid: commonOptions.grid,
      xAxis: {
        type: "category",
        data: chartData.value.descontos.months,
        ...commonOptions.xAxis,
      },
      yAxis: {
        type: "value",
        ...commonOptions.yAxis,
      },
      series: [
        {
          name: "Descontos",
          data: chartData.value.descontos.values,
          type: "bar",
          barWidth: "20%",
          itemStyle: { color: "#0099ff" },
        },
      ],
    });
  }

  if (productChartRef.value) {
    const chart =
      echarts.getInstanceByDom(productChartRef.value) ||
      echarts.init(productChartRef.value);
    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        ...premiumTooltipStyle,
        formatter: (params: any) =>
          getPremiumTooltip(params, params[0].name, formatarMoeda),
      },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: getStyle("--color-text-muted") },
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
        splitLine: commonOptions.yAxis.splitLine,
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
            return value;
          },
          color: getStyle("--color-text-muted"),
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
          color: getStyle("--color-text-muted"),
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
            color: getStyle("--color-text-muted"),
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
  nextTick(() => {
    handleResize();
  });
  window.addEventListener("resize", handleResize);

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    initCharts();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Cleanup observer on unmount
  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener("resize", handleResize);
  });
});

const handleResize = () => {
  if (pieChartRef.value) {
    echarts.getInstanceByDom(pieChartRef.value)?.resize();
  }
  if (lineChartRef.value) {
    echarts.getInstanceByDom(lineChartRef.value)?.resize();
  }
  if (barChartRef.value) {
    echarts.getInstanceByDom(barChartRef.value)?.resize();
  }
  if (discountChartRef.value) {
    echarts.getInstanceByDom(discountChartRef.value)?.resize();
  }
  if (productChartRef.value) {
    echarts.getInstanceByDom(productChartRef.value)?.resize();
  }
};
</script>

<style scoped></style>
