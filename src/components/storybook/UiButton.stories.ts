import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import UiButton from '../ui/UiButton.vue';

const meta: Meta<typeof UiButton> = {
  title: 'UI/UiButton',
  component: UiButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
};

export default meta;
type Story = StoryObj<typeof UiButton>;

export const Default = {
  render: (args) => ({
    components: { UiButton },
    setup() { return { args }; },
    template: '<UiButton v-bind="args">Button</UiButton>',
  }),
};

export const Variants = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="flex flex-wrap gap-2">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="danger">Danger</UiButton>
        <UiButton variant="success">Success</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="link">Link</UiButton>
      </div>
    `,
  }),
};

export const Sizes = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="flex items-center gap-2">
        <UiButton size="small">Small</UiButton>
        <UiButton size="medium">Medium</UiButton>
        <UiButton size="large">Large</UiButton>
      </div>
    `,
  }),
};

export const States = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="flex flex-wrap gap-2">
        <UiButton>Normal</UiButton>
        <UiButton :loading="true">Loading</UiButton>
        <UiButton :disabled="true">Disabled</UiButton>
      </div>
    `,
  }),
};

export const FullWidth = {
  args: { fullWidth: true },
  render: (args) => ({
    components: { UiButton },
    setup() { return { args }; },
    template: '<div style="width: 300px;"><UiButton v-bind="args">Full Width Button</UiButton></div>',
  }),
};

export const Interactive = {
  render: () => ({
    components: { UiButton },
    template: `
      <div class="space-y-4">
        <p>Click count: {{ count }}</p>
        <UiButton @click="count++">Click Me ({{ count }})</UiButton>
      </div>
    `,
    setup() {
      const count = ref(0);
      return { count };
    },
  }),
};
