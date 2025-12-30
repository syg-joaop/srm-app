import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, onMounted, onUnmounted } from 'vue';
import UiSkeletonCard from '../ui/UiSkeletonCard.vue';

const meta: Meta<typeof UiSkeletonCard> = {
  title: 'UI/UiSkeletonCard',
  component: UiSkeletonCard,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: 'number',
      description: 'Número de cards skeleton',
    },
  },
  args: {
    count: 3,
  },
};

export default meta;
type Story = StoryObj<typeof UiSkeletonCard>;

export const Default: Story = {
  render: (args) => ({
    components: { UiSkeletonCard },
    setup() {
      return { args };
    },
    template: '<UiSkeletonCard v-bind="args" />',
  }),
};

export const Single: Story = {
  args: {
    count: 1,
  },
  render: (args) => ({
    components: { UiSkeletonCard },
    setup() {
      return { args };
    },
    template: '<UiSkeletonCard v-bind="args" />',
  }),
};

export const Multiple: Story = {
  args: {
    count: 5,
  },
  render: (args) => ({
    components: { UiSkeletonCard },
    setup() {
      return { args };
    },
    template: '<UiSkeletonCard v-bind="args" />',
  }),
};

export const Many: Story = {
  args: {
    count: 10,
  },
  render: (args) => ({
    components: { UiSkeletonCard },
    setup() {
      return { args };
    },
    template: '<UiSkeletonCard v-bind="args" />',
  }),
};

export const InContainer: Story = {
  render: () => ({
    components: { UiSkeletonCard },
    template: `
      <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 16px;">
        <h4 style="margin: 0 0 16px 0;">Carregando fornecedores...</h4>
        <UiSkeletonCard :count="3" />
      </div>
    `,
  }),
};

export const WithRealDataComparison: Story = {
  render: () => ({
    components: { UiSkeletonCard },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <h4 style="margin: 0 0 12px 0;">Loading State</h4>
          <UiSkeletonCard :count="2" />
        </div>

        <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 16px;">
          <h4 style="margin: 0 0 12px 0;">Real Data</h4>
          <div style="opacity: 0.5; font-size: 0.9rem;">
            [Dados reais seriam exibidos aqui]
          </div>
        </div>
      </div>
    `,
  }),
};

export const AnimationDemo: Story = {
  render: () => ({
    components: { UiSkeletonCard },
    template: `
      <div>
        <p style="margin-bottom: 12px;">O skeleton card possui animações de shimmer e pulse para indicar carregamento</p>
        <UiSkeletonCard :count="3" />
      </div>
    `,
  }),
};
