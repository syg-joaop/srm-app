import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed, reactive } from 'vue';
import UiCheckbox from '../ui/UiCheckbox.vue';

const meta: Meta<typeof UiCheckbox> = {
  title: 'UI/UiCheckbox',
  component: UiCheckbox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Valor do checkbox',
    },
    label: {
      control: 'text',
      description: 'Label do checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilitar checkbox',
    },
    required: {
      control: 'boolean',
      description: 'Campo obrigatório',
    },
    variant: {
      control: 'select',
      options: ['default', 'terms'],
      description: 'Variante visual',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Tamanho',
    },
  },
  args: {
    modelValue: false,
    label: '',
    disabled: false,
    required: false,
    variant: 'default',
    size: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof UiCheckbox>;

export const Default: Story = {
  args: {
    label: 'Aceitar termos',
  },
  render: (args) => ({
    components: { UiCheckbox },
    setup() {
      const checked = ref(args.modelValue);
      return { args, checked };
    },
    template: '<UiCheckbox v-bind="args" v-model="checked" />',
  }),
};

export const Checked: Story = {
  args: {
    label: 'Opção selecionada',
    modelValue: true,
  },
  render: (args) => ({
    components: { UiCheckbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: '<UiCheckbox v-bind="args" v-model="checked" />',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div class="space-y-2">
        <UiCheckbox label="Small" size="small" />
        <UiCheckbox label="Medium" size="medium" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div class="space-y-2">
        <UiCheckbox label="Disabled unchecked" :disabled="true" />
        <UiCheckbox label="Disabled checked" :model-value="true" :disabled="true" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div class="space-y-2">
        <UiCheckbox label="Default variant" variant="default" />
        <UiCheckbox label="Terms variant" variant="terms" />
      </div>
    `,
  }),
};

export const WithSlot: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div class="space-y-2">
        <UiCheckbox>
          <strong>Label em negrito</strong> com texto normal
        </UiCheckbox>
        <UiCheckbox>
          Label com <span style="color: var(--color-primary);">destaque colorido</span>
        </UiCheckbox>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div class="space-y-2">
        <UiCheckbox v-model="options.check1" label="Opção 1" />
        <UiCheckbox v-model="options.check2" label="Opção 2" />
        <UiCheckbox v-model="options.check3" label="Opção 3" />

        <div style="margin-top: 16px; padding: 12px; background: var(--color-surface);">
          <strong>Selecionados:</strong> {{ selectedCount }}
        </div>
      </div>
    `,
    setup() {
      const options = reactive({
        check1: false,
        check2: false,
        check3: false,
      });

      const selectedCount = computed(() => {
        return Object.values(options).filter(v => v).length;
      });

      return { options, selectedCount };
    },
  }),
};

export const TermsExample: Story = {
  render: () => ({
    components: { UiCheckbox },
    template: `
      <div style="max-width: 500px;">
        <UiCheckbox variant="terms" required>
          Eu li e concordo com os <a href="#" style="color: var(--color-primary);">termos de uso</a> e <a href="#" style="color: var(--color-primary);">política de privacidade</a>
        </UiCheckbox>
      </div>
    `,
  }),
};
