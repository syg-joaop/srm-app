import UiBadge from "../ui/UiBadge.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

/**
 * Meta configuração do componente UiBadge
 */
const meta: Meta<typeof UiBadge> = {
  title: "UI/UiBadge",
  component: UiBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info", "neutral"],
      description: "Variante visual do badge",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Tamanho do badge",
    },
    dot: {
      control: "boolean",
      description: "Mostrar indicador (dot)",
    },
  },
  args: {
    variant: "default",
    size: "medium",
    dot: false,
  },
};

export default meta;
type Story = StoryObj<typeof UiBadge>;

/**
 * Story: Default
 * Badge com configuração padrão
 */
export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args: InstanceType<typeof UiBadge>) => ({
    components: { UiBadge },
    setup: () => ({ args }),
    template: '<UiBadge v-bind="args">Badge Default</UiBadge>',
  }),
};

/**
 * Story: Variants
 * Todos os variantes disponíveis
 */
export const Variants: Story = {
  render: () => ({
    components: { UiBadge },
    template: `
      <div class="flex flex-wrap gap-3">
        <UiBadge variant="default">Default</UiBadge>
        <UiBadge variant="primary">Primary</UiBadge>
        <UiBadge variant="success">Success</UiBadge>
        <UiBadge variant="warning">Warning</UiBadge>
        <UiBadge variant="danger">Danger</UiBadge>
        <UiBadge variant="info">Info</UiBadge>
        <UiBadge variant="neutral">Neutral</UiBadge>
      </div>
    `,
  }),
};

/**
 * Story: Sizes
 * Todos os tamanhos disponíveis
 */
export const Sizes: Story = {
  render: () => ({
    components: { UiBadge },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <UiBadge size="small">Small</UiBadge>
        <UiBadge size="medium">Medium</UiBadge>
        <UiBadge size="large">Large</UiBadge>
      </div>
    `,
  }),
};

/**
 * Story: With Dot
 * Badges com indicador (dot)
 */
export const WithDot: Story = {
  render: () => ({
    components: { UiBadge },
    template: `
      <div class="flex flex-wrap gap-3">
        <UiBadge variant="primary" :dot="true">Primary Dot</UiBadge>
        <UiBadge variant="success" :dot="true">Success Dot</UiBadge>
        <UiBadge variant="warning" :dot="true">Warning Dot</UiBadge>
        <UiBadge variant="danger" :dot="true">Danger Dot</UiBadge>
      </div>
    `,
  }),
};

/**
 * Story: Combined
 * Combinações de variantes e tamanhos
 */
export const Combined: Story = {
  render: () => ({
    components: { UiBadge },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <UiBadge variant="primary" size="small">Small Primary</UiBadge>
          <UiBadge variant="success" size="small">Small Success</UiBadge>
          <UiBadge variant="warning" size="small">Small Warning</UiBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiBadge variant="primary" size="medium">Medium Primary</UiBadge>
          <UiBadge variant="success" size="medium">Medium Success</UiBadge>
          <UiBadge variant="warning" size="medium">Medium Warning</UiBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UiBadge variant="primary" size="large">Large Primary</UiBadge>
          <UiBadge variant="success" size="large">Large Success</UiBadge>
          <UiBadge variant="warning" size="large">Large Warning</UiBadge>
        </div>
      </div>
    `,
  }),
};
