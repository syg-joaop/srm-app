import UiSegmentedControl from "../ui/UiSegmentedControl.vue";

import type { Meta, StoryObj } from "@storybook/vue3";
import { LayoutGrid, List, Settings as SettingsIcon } from "lucide-vue-next";

/**
 * Meta configuração do componente UiSegmentedControl
 */
const meta: Meta<typeof UiSegmentedControl> = {
  title: "UI/UiSegmentedControl",
  component: UiSegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "Valor selecionado",
    },
    options: {
      control: "object",
      description: "Lista de opções",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Tamanho do componente",
    },
    fullWidth: {
      control: "boolean",
      description: "Ocupar largura total",
    },
    hideLabelsOnMobile: {
      control: "boolean",
      description: "Esconder rótulos em mobile",
    },
  },
  args: {
    modelValue: "tab1",
    options: [
      { label: "Opção 1", value: "tab1" },
      { label: "Opção 2", value: "tab2" },
      { label: "Opção 3", value: "tab3" },
    ],
    size: "md",
    fullWidth: false,
    hideLabelsOnMobile: false,
  },
};

export default meta;
type Story = StoryObj<typeof UiSegmentedControl>;

/**
 * Story: Default
 * Segmented Control com configuração padrão
 */
export const Default: Story = {
  args: {
    modelValue: "tab1",
    options: [
      { label: "Dia", value: "day" },
      { label: "Semana", value: "week" },
      { label: "Mês", value: "month" },
    ],
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">Selecionado: {{ value }}</p>
      </div>
    `,
  }),
};

/**
 * Story: With Icons
 * Segmented Control com ícones
 */
export const WithIcons: Story = {
  args: {
    modelValue: "grid",
    options: [
      { label: "Grid", value: "grid", icon: LayoutGrid },
      { label: "Lista", value: "list", icon: List },
      { label: "Config", value: "settings", icon: SettingsIcon },
    ],
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">Selecionado: {{ value }}</p>
      </div>
    `,
  }),
};

/**
 * Story: Sizes
 * Tamanhos disponíveis
 */
export const Sizes: Story = {
  render: () => ({
    components: { UiSegmentedControl },
    setup() {
      const xs = ref("opt1");
      const sm = ref("opt1");
      const md = ref("opt1");
      const lg = ref("opt1");
      const options = [
        { label: "Opção 1", value: "opt1" },
        { label: "Opção 2", value: "opt2" },
        { label: "Opção 3", value: "opt3" },
      ];
      return { xs, sm, md, lg, options };
    },
    template: `
      <div class="p-8 space-y-8">
        <div>
          <p class="text-sm text-[var(--color-text-muted)] mb-2">Extra Small (xs)</p>
          <UiSegmentedControl v-model="xs" :options="options" size="xs" />
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-muted)] mb-2">Small (sm)</p>
          <UiSegmentedControl v-model="sm" :options="options" size="sm" />
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-muted)] mb-2">Medium (md)</p>
          <UiSegmentedControl v-model="md" :options="options" size="md" />
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-muted)] mb-2">Large (lg)</p>
          <UiSegmentedControl v-model="lg" :options="options" size="lg" />
        </div>
      </div>
    `,
  }),
};

/**
 * Story: Full Width
 * Segmented Control com largura total
 */
export const FullWidth: Story = {
  args: {
    modelValue: "all",
    options: [
      { label: "Todos", value: "all" },
      { label: "Ativos", value: "active" },
      { label: "Inativos", value: "inactive" },
    ],
    fullWidth: true,
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8 max-w-md">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">Selecionado: {{ value }}</p>
      </div>
    `,
  }),
};

/**
 * Story: Two Options
 * Segmented Control com apenas duas opções
 */
export const TwoOptions: Story = {
  args: {
    modelValue: "on",
    options: [
      { label: "Ligado", value: "on" },
      { label: "Desligado", value: "off" },
    ],
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">Status: {{ value }}</p>
      </div>
    `,
  }),
};

/**
 * Story: Many Options
 * Segmented Control com muitas opções
 */
export const ManyOptions: Story = {
  args: {
    modelValue: "jan",
    options: [
      { label: "Jan", value: "jan" },
      { label: "Fev", value: "fev" },
      { label: "Mar", value: "mar" },
      { label: "Abr", value: "abr" },
      { label: "Mai", value: "mai" },
      { label: "Jun", value: "jun" },
    ],
    size: "sm",
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">Mês: {{ value }}</p>
      </div>
    `,
  }),
};

/**
 * Story: Mobile Responsive
 * Segmented Control responsivo para mobile
 */
export const MobileResponsive: Story = {
  args: {
    modelValue: "grid",
    options: [
      { label: "Grid", value: "grid", icon: LayoutGrid },
      { label: "Lista", value: "list", icon: List },
    ],
    size: "md",
    mobileSize: "sm",
    hideLabelsOnMobile: true,
  },
  render: (args) => ({
    components: { UiSegmentedControl },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="p-8 max-w-sm">
        <UiSegmentedControl v-bind="args" v-model="value" />
        <p class="mt-4 text-sm text-[var(--color-text-muted)]">
          Redimensione para mobile para ver a diferença
        </p>
      </div>
    `,
  }),
};
