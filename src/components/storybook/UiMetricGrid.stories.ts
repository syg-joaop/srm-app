import UiMetricGrid from "../ui/UiMetricGrid.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof UiMetricGrid> = {
  title: "UI/UiMetricGrid",
  component: UiMetricGrid,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array de métricas",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UiMetricGrid>;

const sampleItems = [
  { label: "Vendas", value: "R$ 45.230" },
  { label: "Pedidos", value: "234" },
  { label: "Clientes", value: "156" },
  { label: "Ticket Médio", value: "R$ 193,25" },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
  render: (args: InstanceType<typeof UiMetricGrid>) => ({
    components: { UiMetricGrid },
    setup: () => ({ args }),
    template: '<UiMetricGrid v-bind="args" />',
  }),
};

export const Minimal: Story = {
  args: {
    items: [
      { label: "Ativos", value: "45" },
      { label: "Inativos", value: "12" },
    ],
  },
};

export const ManyMetrics: Story = {
  args: {
    items: [
      { label: "Vendas", value: "R$ 45.230" },
      { label: "Pedidos", value: "234" },
      { label: "Clientes", value: "156" },
      { label: "Ticket Médio", value: "R$ 193,25" },
      { label: "Conversão", value: "12,5%" },
      { label: "Cancelamentos", value: "8" },
    ],
  },
};

export const FinancialMetrics: Story = {
  args: {
    items: [
      { label: "Receita Bruta", value: "R$ 125.430" },
      { label: "Custos", value: "R$ 45.200" },
      { label: "Lucro", value: "R$ 80.230" },
      { label: "Margem", value: "64%" },
    ],
  },
};

export const OperationalMetrics: Story = {
  args: {
    items: [
      { label: "Pedidos/Hora", value: "23" },
      { label: "Tempo Médio", value: "15min" },
      { label: "Eficiência", value: "94%" },
      { label: "Erro", value: "0,5%" },
    ],
  },
};

export const Percentages: Story = {
  args: {
    items: [
      { label: "Conversão", value: "12,5%" },
      { label: "Retenção", value: "68,3%" },
      { label: "Churn", value: "4,2%" },
      { label: "Satisfação", value: "92,7%" },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    items: [
      { label: "Usuários Totais", value: "1.234.567" },
      { label: "Usuários Ativos", value: "856.432" },
      { label: "Novos (Mês)", value: "45.678" },
      { label: "Cancelamentos", value: "2.345" },
    ],
  },
};

export const Responsive: Story = {
  render: () => ({
    components: { UiMetricGrid },
    template: `
      <div>
        <UiMetricGrid
          :items="[
            { label: 'Métrica 1', value: 'Valor 1' },
            { label: 'Métrica 2', value: 'Valor 2' },
            { label: 'Métrica 3', value: 'Valor 3' },
            { label: 'Métrica 4', value: 'Valor 4' },
          ]"
        />
        <p class="text-xs text-muted mt-4">Redimensione a tela para ver o grid responsivo</p>
      </div>
    `,
  }),
};
