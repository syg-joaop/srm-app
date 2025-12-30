import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import UiInput from '../ui/UiInput.vue';

const meta: Meta<typeof UiInput> = {
  title: 'UI/UiInput',
  component: UiInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof UiInput>;

export const Default = {
  render: (args) => ({
    components: { UiInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<UiInput v-bind="args" v-model="value" />',
  }),
};

export const WithLabel = {
  args: { label: 'Nome Completo' },
  render: (args) => ({
    components: { UiInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<UiInput v-bind="args" v-model="value" />',
  }),
};

export const WithError = {
  args: { label: 'E-mail', error: 'E-mail inválido' },
  render: (args) => ({
    components: { UiInput },
    setup() {
      const value = ref('invalid-email');
      return { args, value };
    },
    template: '<UiInput v-bind="args" v-model="value" />',
  }),
};

export const WithHint = {
  args: {
    label: 'Senha',
    type: 'password',
    hint: 'Mínimo de 8 caracteres',
  },
  render: (args) => ({
    components: { UiInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<UiInput v-bind="args" v-model="value" />',
  }),
};

export const States = {
  render: () => ({
    components: { UiInput },
    template: `
      <div class="space-y-4" style="max-width: 400px;">
        <UiInput label="Normal" placeholder="Digite algo..." />
        <UiInput label="Disabled" :disabled="true" value="Não pode editar" />
        <UiInput label="Readonly" :readonly="true" value="Apenas leitura" />
        <UiInput label="Required" :required="true" placeholder="Campo obrigatório" />
      </div>
    `,
  }),
};

export const Types = {
  render: () => ({
    components: { UiInput },
    template: `
      <div class="space-y-4" style="max-width: 400px;">
        <UiInput label="Texto" type="text" placeholder="Nome" />
        <UiInput label="E-mail" type="email" placeholder="email@exemplo.com" />
        <UiInput label="Senha" type="password" placeholder="••••••••" />
        <UiInput label="Número" type="number" placeholder="123" />
      </div>
    `,
  }),
};

export const WithSlots = {
  render: () => ({
    components: { UiInput },
    template: `
      <div class="space-y-4" style="max-width: 400px;">
        <UiInput label="Com Prefix" v-model="search">
          <template #prefix>
            <span style="color: var(--color-text-muted);">🔍</span>
          </template>
        </UiInput>

        <UiInput label="Com Suffix" v-model="url">
          <template #suffix>
            <span style="color: var(--color-text-muted);">.com</span>
          </template>
        </UiInput>
      </div>
    `,
    setup() {
      const search = ref('');
      const url = ref('');
      return { search, url };
    },
  }),
};
