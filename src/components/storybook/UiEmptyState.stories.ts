import type { Meta, StoryObj } from '@storybook/vue3';
import { Inbox, AlertCircle, CheckCircle, Search } from 'lucide-vue-next';
import UiEmptyState from '../ui/UiEmptyState.vue';

const meta: Meta<typeof UiEmptyState> = {
  title: 'UI/UiEmptyState',
  component: UiEmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título principal',
    },
    description: {
      control: 'text',
      description: 'Descrição detalhada',
    },
  },
  args: {
    title: 'Nenhum dado encontrado',
    description: '',
  },
};

export default meta;
type Story = StoryObj<typeof UiEmptyState>;

export const Default: Story = {
  render: (args) => ({
    components: { UiEmptyState },
    setup() {
      return { args };
    },
    template: '<UiEmptyState v-bind="args" />',
  }),
};

export const WithDescription: Story = {
  args: {
    title: 'Nenhum resultado encontrado',
    description: 'Tente ajustar os filtros de busca para encontrar o que procura.',
  },
  render: (args) => ({
    components: { UiEmptyState },
    setup() {
      return { args };
    },
    template: '<UiEmptyState v-bind="args" />',
  }),
};

export const WithIcon: Story = {
  render: () => ({
    components: { UiEmptyState, Inbox },
    template: `
      <div style="height: 300px;">
        <UiEmptyState
          :icon="Inbox"
          title="Caixa de entrada vazia"
          description="Você não tem mensagens no momento."
        />
      </div>
    `,
  }),
};

export const WithAction: Story = {
  render: () => ({
    components: { UiEmptyState, Search },
    template: `
      <div style="height: 300px;">
        <UiEmptyState
          :icon="Search"
          title="Nenhuma rota encontrada"
          description="Crie sua primeira rota para começar."
        >
          <template #action>
            <button style="padding: 8px 16px; background: var(--color-primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Criar Rota
            </button>
          </template>
        </UiEmptyState>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  render: () => ({
    components: { UiEmptyState, AlertCircle },
    template: `
      <div style="height: 300px;">
        <UiEmptyState
          :icon="AlertCircle"
          title="Erro ao carregar dados"
          description="Ocorreu um erro ao carregar as informações. Tente novamente."
        >
          <template #action>
            <button style="padding: 8px 16px; background: var(--color-danger); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Tentar Novamente
            </button>
          </template>
        </UiEmptyState>
      </div>
    `,
  }),
};

export const SuccessState: Story = {
  render: () => ({
    components: { UiEmptyState, CheckCircle },
    template: `
      <div style="height: 300px;">
        <UiEmptyState
          :icon="CheckCircle"
          title="Tudo concluído!"
          description="Todas as tarefas foram concluídas com sucesso."
        />
      </div>
    `,
  }),
};

export const MultipleStates: Story = {
  render: () => ({
    components: { UiEmptyState, Inbox, Search, AlertCircle },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="height: 250px; border: 1px solid var(--color-border); border-radius: 8px;">
          <UiEmptyState
            :icon="Inbox"
            title="Vazio"
            description="Sem dados"
          />
        </div>

        <div style="height: 250px; border: 1px solid var(--color-border); border-radius: 8px;">
          <UiEmptyState
            :icon="Search"
            title="Sem resultados"
            description="Nada encontrado"
          />
        </div>

        <div style="height: 250px; border: 1px solid var(--color-border); border-radius: 8px;">
          <UiEmptyState
            :icon="AlertCircle"
            title="Erro"
            description="Falha na requisição"
          />
        </div>

        <div style="height: 250px; border: 1px solid var(--color-border); border-radius: 8px;">
          <UiEmptyState
            title="Sem título"
            description="Apenas com descrição"
          />
        </div>
      </div>
    `,
  }),
};
