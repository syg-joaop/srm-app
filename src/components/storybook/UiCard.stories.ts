import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch, onMounted } from 'vue';
import UiCard from '../ui/UiCard.vue';

const meta: Meta<typeof UiCard> = {
  title: 'UI/UiCard',
  component: UiCard,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do card',
    },
    hoverable: {
      control: 'boolean',
      description: 'Efeito hover elevado',
    },
    clickable: {
      control: 'boolean',
      description: 'Card clicável',
    },
    noPadding: {
      control: 'boolean',
      description: 'Remover padding do body',
    },
  },
  args: {
    title: '',
    hoverable: false,
    clickable: false,
    noPadding: false,
  },
};

export default meta;
type Story = StoryObj<typeof UiCard>;

export const Default: Story = {
  render: (args) => ({
    components: { UiCard },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px;">
        <UiCard v-bind="args">
          <p>Conteúdo do card aqui.</p>
        </UiCard>
      </div>
    `,
  }),
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
  },
  render: (args) => ({
    components: { UiCard },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px;">
        <UiCard v-bind="args">
          <p>Conteúdo do card aqui.</p>
        </UiCard>
      </div>
    `,
  }),
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
  },
  render: (args) => ({
    components: { UiCard },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px;">
        <UiCard v-bind="args">
          <p>Passe o mouse para ver o efeito hover.</p>
        </UiCard>
      </div>
    `,
  }),
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    clickable: true,
  },
  render: (args) => ({
    components: { UiCard },
    setup() {
      const handleClick = () => alert('Card clicado!');
      return { args, handleClick };
    },
    template: `
      <div style="width: 400px;">
        <UiCard v-bind="args" @click="handleClick">
          <p>Clique neste card.</p>
        </UiCard>
      </div>
    `,
  }),
};

export const WithSlots: Story = {
  render: () => ({
    components: { UiCard },
    template: `
      <div style="width: 400px;">
        <UiCard>
          <template #header>
            <h3 style="margin: 0;">Header Customizado</h3>
          </template>

          <template #actions>
            <button style="padding: 4px 8px;">Action 1</button>
            <button style="padding: 4px 8px;">Action 2</button>
          </template>

          <p>Conteúdo principal do card.</p>

          <template #footer>
            <small>Footer do card</small>
          </template>
        </UiCard>
      </div>
    `,
  }),
};

export const NoPadding: Story = {
  args: {
    title: 'Sem Padding',
    noPadding: true,
  },
  render: (args) => ({
    components: { UiCard },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 400px;">
        <UiCard v-bind="args">
          <div style="padding: 20px; background: var(--color-surface-hover);">
            Conteúdo com padding customizado
          </div>
        </UiCard>
      </div>
    `,
  }),
};

export const ComplexCard: Story = {
  render: () => ({
    components: { UiCard },
    template: `
      <div style="width: 400px;">
        <UiCard hoverable clickable>
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0;">Dashboard</h3>
              <span style="font-size: 0.8rem; opacity: 0.7;">Última atualização: 10min</span>
            </div>
          </template>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div style="font-size: 0.8rem; opacity: 0.7;">Vendas</div>
              <div style="font-size: 1.5rem; font-weight: bold;">R$ 45.230</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; opacity: 0.7;">Pedidos</div>
              <div style="font-size: 1.5rem; font-weight: bold;">234</div>
            </div>
          </div>

          <template #footer>
            <button style="padding: 6px 12px; width: 100%;">Ver Detalhes</button>
          </template>
        </UiCard>
      </div>
    `,
  }),
};
