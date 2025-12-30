import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, reactive } from 'vue';
import UiToggle from '../ui/UiToggle.vue';

const meta: Meta<typeof UiToggle> = {
  title: 'UI/UiToggle',
  component: UiToggle,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Estado do toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilitar toggle',
    },
  },
  args: {
    modelValue: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof UiToggle>;

export const Default: Story = {
  render: (args) => ({
    components: { UiToggle },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: '<UiToggle v-bind="args" v-model="value" />',
  }),
};

export const On: Story = {
  args: {
    modelValue: true,
  },
  render: (args) => ({
    components: { UiToggle },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: '<UiToggle v-bind="args" v-model="value" />',
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { UiToggle },
    template: `
      <div class="space-y-4">
        <UiToggle :model-value="false" :disabled="true" />
        <UiToggle :model-value="true" :disabled="true" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { UiToggle },
    template: `
      <div class="space-y-4">
        <div style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="notifications" />
          <span>Receber notificações</span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="darkMode" />
          <span>Modo escuro</span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="autoSave" />
          <span>Salvar automaticamente</span>
        </div>

        <div style="margin-top: 16px; padding: 12px; background: var(--color-surface);">
          <div>Notificações: {{ notifications ? 'Ativo' : 'Inativo' }}</div>
          <div>Modo escuro: {{ darkMode ? 'Ativo' : 'Inativo' }}</div>
          <div>Auto-save: {{ autoSave ? 'Ativo' : 'Inativo' }}</div>
        </div>
      </div>
    `,
    setup() {
      const notifications = ref(false);
      const darkMode = ref(false);
      const autoSave = ref(true);

      return { notifications, darkMode, autoSave };
    },
  }),
};

export const WithLabel: Story = {
  render: () => ({
    components: { UiToggle },
    template: `
      <div class="space-y-3">
        <label style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="wifi" />
          <span>Wi-Fi</span>
        </label>

        <label style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="bluetooth" />
          <span>Bluetooth</span>
        </label>

        <label style="display: flex; align-items: center; gap: 12px;">
          <UiToggle v-model="location" />
          <span>Localização</span>
        </label>
      </div>
    `,
    setup() {
      const wifi = ref(true);
      const bluetooth = ref(false);
      const location = ref(true);

      return { wifi, bluetooth, location };
    },
  }),
};

export const Multiple: Story = {
  render: () => ({
    components: { UiToggle },
    template: `
      <div class="space-y-2">
        <div style="display: flex; align-items: center; gap: 8px;">
          <UiToggle v-model="settings.option1" />
          <span>Option 1</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <UiToggle v-model="settings.option2" />
          <span>Option 2</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <UiToggle v-model="settings.option3" />
          <span>Option 3</span>
        </div>
      </div>
    `,
    setup() {
      const settings = reactive({
        option1: true,
        option2: false,
        option3: true,
      });

      return { settings };
    },
  }),
};
