import type { Meta, StoryObj } from '@storybook/vue3';
import UiChartLegend from '../ui/UiChartLegend.vue';

const meta: Meta<typeof UiChartLegend> = {
  title: 'UI/UiChartLegend',
  component: UiChartLegend,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array de itens da legenda',
    },
  },
};

export default meta;
type Story = StoryObj<typeof UiChartLegend>;

const sampleItems = [
  { value: '45%', label: 'Vendas', color: 'green' as const },
  { value: '30%', label: 'Marketing', color: 'blue' as const },
  { value: '15%', label: 'Operação', color: 'yellow' as const },
  { value: '10%', label: 'Outros', color: 'gray' as const },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
  render: (args) => ({
    components: { UiChartLegend },
    setup() {
      return { args };
    },
    template: '<UiChartLegend v-bind="args" />',
  }),
};

export const Minimal: Story = {
  args: {
    items: [
      { value: '80%', label: 'Ativo', color: 'green' as const },
      { value: '20%', label: 'Inativo', color: 'red' as const },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { value: '35%', label: 'Produto A', color: 'blue' as const },
      { value: '25%', label: 'Produto B', color: 'green' as const },
      { value: '20%', label: 'Produto C', color: 'yellow' as const },
      { value: '12%', label: 'Produto D', color: 'purple' as const },
      { value: '8%', label: 'Produto E', color: 'red' as const },
    ],
  },
};

export const WithNumbers: Story = {
  args: {
    items: [
      { value: '1.234', label: 'Vendas', color: 'green' as const },
      { value: '856', label: 'Pedidos', color: 'blue' as const },
      { value: '45', label: 'Devoluções', color: 'red' as const },
    ],
  },
};

export const AllColors: Story = {
  args: {
    items: [
      { value: 'Green', label: 'Verde', color: 'green' as const },
      { value: 'Yellow', label: 'Amarelo', color: 'yellow' as const },
      { value: 'Red', label: 'Vermelho', color: 'red' as const },
      { value: 'Blue', label: 'Azul', color: 'blue' as const },
      { value: 'Purple', label: 'Roxo', color: 'purple' as const },
      { value: 'Gray', label: 'Cinza', color: 'gray' as const },
    ],
  },
};

export const Responsive: Story = {
  render: () => ({
    components: { UiChartLegend },
    template: `
      <div>
        <UiChartLegend
          :items="[
            { value: '45%', label: 'Categoria 1', color: 'green' },
            { value: '30%', label: 'Categoria 2', color: 'blue' },
            { value: '15%', label: 'Categoria 3', color: 'yellow' },
            { value: '10%', label: 'Categoria 4', color: 'red' },
          ]"
        />
        <p class="text-xs text-muted mt-4">Redimensione a tela para ver o comportamento responsivo</p>
      </div>
    `,
  }),
};
