import UiSelect from "../ui/UiSelect.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

/**
 * Meta configuração do componente UiSelect
 */
const meta: Meta<typeof UiSelect> = {
  title: "UI/UiSelect",
  component: UiSelect,
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
    label: {
      control: "text",
      description: "Rótulo do campo",
    },
    placeholder: {
      control: "text",
      description: "Texto de placeholder",
    },
    disabled: {
      control: "boolean",
      description: "Desabilitar componente",
    },
    required: {
      control: "boolean",
      description: "Campo obrigatório",
    },
    searchable: {
      control: "boolean",
      description: "Habilitar busca",
    },
    error: {
      control: "text",
      description: "Mensagem de erro",
    },
    hint: {
      control: "text",
      description: "Texto de ajuda",
    },
  },
  args: {
    modelValue: null,
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione",
    placeholder: "Selecione uma opção",
    disabled: false,
    required: false,
    searchable: false,
    error: "",
    hint: "",
  },
};

export default meta;
type Story = StoryObj<typeof UiSelect>;

/**
 * Story: Default
 * Select com configuração padrão
 */
export const Default: Story = {
  args: {
    modelValue: null,
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione uma opção",
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: With Objects
 * Select com opções como objetos
 */
export const WithObjects: Story = {
  args: {
    modelValue: "br",
    options: [
      { label: "Brasil", value: "br" },
      { label: "Estados Unidos", value: "us" },
      { label: "Argentina", value: "ar" },
    ],
    label: "País",
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: Searchable
 * Select com busca habilitada
 */
export const Searchable: Story = {
  args: {
    modelValue: null,
    options: [
      "Apple", "Banana", "Cherry", "Date", "Elderberry",
      "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"
    ],
    label: "Fruta",
    searchable: true,
    placeholder: "Buscar fruta...",
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: With Error
 * Select com estado de erro
 */
export const WithError: Story = {
  args: {
    modelValue: null,
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione",
    error: "Este campo é obrigatório",
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: With Hint
 * Select com texto de ajuda
 */
export const WithHint: Story = {
  args: {
    modelValue: null,
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione",
    hint: "Escolha uma das opções disponíveis",
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: Disabled
 * Select desabilitado
 */
export const Disabled: Story = {
  args: {
    modelValue: "Opção 1",
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione",
    disabled: true,
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: Required
 * Select com campo obrigatório
 */
export const Required: Story = {
  args: {
    modelValue: null,
    options: ["Opção 1", "Opção 2", "Opção 3"],
    label: "Selecione",
    required: true,
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};

/**
 * Story: Many Options
 * Select com muitas opções
 */
export const ManyOptions: Story = {
  args: {
    modelValue: null,
    options: Array.from({ length: 50 }, (_, i) => `Opção ${i + 1}`),
    label: "Selecione",
    searchable: true,
  },
  render: (args) => ({
    components: { UiSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div class="w-80">
        <UiSelect v-bind="args" v-model="value" />
      </div>
    `,
  }),
};
