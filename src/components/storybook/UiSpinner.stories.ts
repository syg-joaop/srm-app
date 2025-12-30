import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import UiSpinner from '../ui/UiSpinner.vue';

const meta: Meta<typeof UiSpinner> = {
  title: 'UI/UiSpinner',
  component: UiSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do spinner',
    },
    variant: {
      control: 'select',
      options: ['primary', 'white', 'dark'],
      description: 'Variante visual',
    },
    text: {
      control: 'text',
      description: 'Texto de carregamento',
    },
  },
  args: {
    size: 'medium',
    variant: 'primary',
    text: '',
  },
};

export default meta;
type Story = StoryObj<typeof UiSpinner>;

export const Default: Story = {
  render: (args) => ({
    components: { UiSpinner },
    setup() {
      return { args };
    },
    template: '<UiSpinner v-bind="args" />',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { UiSpinner },
    template: `
      <div class="flex items-center gap-8">
        <UiSpinner size="small" />
        <UiSpinner size="medium" />
        <UiSpinner size="large" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { UiSpinner },
    template: `
      <div class="flex items-center gap-8">
        <UiSpinner variant="primary" />
        <UiSpinner variant="white" />
        <UiSpinner variant="dark" />
      </div>
    `,
  }),
};

export const WithText: Story = {
  render: () => ({
    components: { UiSpinner },
    template: `
      <div class="space-y-4">
        <UiSpinner text="Carregando dados..." />
        <UiSpinner text="Processando pedido..." variant="white" />
        <UiSpinner text="Aguarde..." variant="dark" />
      </div>
    `,
  }),
};

export const Combined: Story = {
  render: () => ({
    components: { UiSpinner },
    template: `
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <UiSpinner size="small" text="Small" />
          <UiSpinner size="medium" text="Medium" />
          <UiSpinner size="large" text="Large" />
        </div>
      </div>
    `,
  }),
};
