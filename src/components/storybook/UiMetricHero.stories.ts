import type { Meta, StoryObj } from '@storybook/vue3';
import { computed } from 'vue';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-vue-next';
import UiMetricHero from '../ui/UiMetricHero.vue';

const meta: Meta<typeof UiMetricHero> = {
  title: 'UI/UiMetricHero',
  component: UiMetricHero,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'object',
      description: 'Componente de ícone (Lucide)',
    },
    label: {
      control: 'text',
      description: 'Rótulo da métrica',
    },
    value: {
      control: 'text',
      description: 'Valor da métrica',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
      description: 'Variante de cor',
    },
    iconSize: {
      control: 'number',
      description: 'Tamanho do ícone',
    },
  },
  args: {
    label: 'Vendas',
    value: 'R$ 45.230,50',
    variant: 'primary',
    iconSize: 32,
  },
};

export default meta;
type Story = StoryObj<typeof UiMetricHero>;

export const Default: Story = {
  args: {
    icon: DollarSign,
  },
  render: (args) => ({
    components: { UiMetricHero },
    setup() {
      return { args };
    },
    template: '<UiMetricHero v-bind="args" />',
  }),
};

export const Sales: Story = {
  args: {
    icon: DollarSign,
    label: 'Vendas do Dia',
    value: 'R$ 45.230,50',
    variant: 'success',
  },
};

export const Orders: Story = {
  args: {
    icon: ShoppingCart,
    label: 'Pedidos Pendentes',
    value: '23',
    variant: 'warning',
  },
};

export const Customers: Story = {
  args: {
    icon: Users,
    label: 'Clientes Ativos',
    value: '1.567',
    variant: 'primary',
  },
};

export const Growth: Story = {
  args: {
    icon: TrendingUp,
    label: 'Crescimento',
    value: '+12.5%',
    variant: 'success',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { UiMetricHero, DollarSign, ShoppingCart, Users, TrendingUp },
    template: `
      <div class="space-y-4">
        <UiMetricHero
          :icon="DollarSign"
          label="Vendas"
          value="R$ 45.230"
          variant="primary"
        />
        <UiMetricHero
          :icon="ShoppingCart"
          label="Pedidos"
          value="234"
          variant="success"
        />
        <UiMetricHero
          :icon="Users"
          label="Clientes"
          value="156"
          variant="warning"
        />
        <UiMetricHero
          :icon="TrendingUp"
          label="Crescimento"
          value="+12.5%"
          variant="danger"
        />
      </div>
    `,
  }),
};

export const CustomSizes: Story = {
  render: () => ({
    components: { UiMetricHero, DollarSign },
    template: `
      <div class="space-y-4">
        <UiMetricHero
          :icon="DollarSign"
          label="Pequeno"
          value="R$ 1.000"
          :icon-size="20"
        />
        <UiMetricHero
          :icon="DollarSign"
          label="Médio"
          value="R$ 10.000"
          :icon-size="28"
        />
        <UiMetricHero
          :icon="DollarSign"
          label="Grande"
          value="R$ 100.000"
          :icon-size="40"
        />
      </div>
    `,
  }),
};

export const LargeValues: Story = {
  render: () => ({
    components: { UiMetricHero, TrendingUp },
    template: `
      <div class="space-y-4">
        <UiMetricHero
          :icon="TrendingUp"
          label="Receita Total"
          value="R$ 1.234.567,89"
          variant="success"
        />
        <UiMetricHero
          :icon="TrendingUp"
          label="Usuários Ativos"
          value="45.678"
          variant="primary"
        />
        <UiMetricHero
          :icon="TrendingUp"
          label="Taxa de Conversão"
          value="12,56%"
          variant="warning"
        />
      </div>
    `,
  }),
};
