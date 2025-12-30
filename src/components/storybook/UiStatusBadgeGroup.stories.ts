import UiStatusBadgeGroup from "../ui/UiStatusBadgeGroup.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

/**
 * Meta configuração do componente UiStatusBadgeGroup
 */
const meta: Meta<typeof UiStatusBadgeGroup> = {
  title: "UI/UiStatusBadgeGroup",
  component: UiStatusBadgeGroup,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Lista de badges com valores, cores e ícones",
    },
  },
  args: {
    items: [
      { value: "5", label: "Concluídos", color: "green", icon: "check" },
      { value: "3", label: "Em andamento", color: "yellow", icon: "clock" },
      { value: "2", label: "Pendentes", color: "blue", icon: "default" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof UiStatusBadgeGroup>;

/**
 * Story: Default
 * Grupo de badges padrão
 */
export const Default: Story = {
  args: {
    items: [
      { value: "12", label: "Concluídos", color: "green", icon: "check" },
      { value: "5", label: "Em andamento", color: "yellow", icon: "clock" },
      { value: "3", label: "Pendentes", color: "blue", icon: "default" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Task Status
 * Status de tarefas
 */
export const TaskStatus: Story = {
  args: {
    items: [
      { value: "24", label: "Total de tarefas", color: "blue", icon: "calendar" },
      { value: "18", label: "Concluídas", color: "green", icon: "check" },
      { value: "4", label: "Em progresso", color: "yellow", icon: "clock" },
      { value: "2", label: "Atrasadas", color: "red", icon: "x" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Status do Projeto</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Sales Dashboard
 * Dashboard de vendas
 */
export const SalesDashboard: Story = {
  args: {
    items: [
      { value: "R$ 45K", label: "Vendas do mês", color: "green", icon: "check" },
      { value: "127", label: "Pedidos", color: "blue", icon: "calendar" },
      { value: "12", label: "Pendentes", color: "yellow", icon: "clock" },
      { value: "5", label: "Cancelados", color: "red", icon: "x" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Resumo de Vendas</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: User Activity
 * Atividade de usuários
 */
export const UserActivity: Story = {
  args: {
    items: [
      { value: "1.2K", label: "Usuários ativos", color: "green", icon: "check" },
      { value: "345", label: "Novos hoje", color: "blue", icon: "calendar" },
      { value: "89", label: "Online agora", color: "purple", icon: "default" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Atividade de Usuários</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Two Badges
 * Apenas dois badges
 */
export const TwoBadges: Story = {
  args: {
    items: [
      { value: "85%", label: "Concluído", color: "green", icon: "check" },
      { value: "15%", label: "Restante", color: "gray", icon: "default" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Progresso</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Many Badges
 * Muitos badges
 */
export const ManyBadges: Story = {
  args: {
    items: [
      { value: "45", label: "Categoria A", color: "green", icon: "check" },
      { value: "32", label: "Categoria B", color: "blue", icon: "calendar" },
      { value: "28", label: "Categoria C", color: "purple", icon: "default" },
      { value: "19", label: "Categoria D", color: "yellow", icon: "clock" },
      { value: "12", label: "Categoria E", color: "red", icon: "x" },
      { value: "8", label: "Categoria F", color: "gray", icon: "default" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Distribuição por Categoria</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: All Colors
 * Exemplo de todas as cores disponíveis
 */
export const AllColors: Story = {
  args: {
    items: [
      { value: "Red", label: "Vermelho", color: "red", icon: "x" },
      { value: "Green", label: "Verde", color: "green", icon: "check" },
      { value: "Yellow", label: "Amarelo", color: "yellow", icon: "clock" },
      { value: "Blue", label: "Azul", color: "blue", icon: "calendar" },
      { value: "Purple", label: "Roxo", color: "purple", icon: "default" },
      { value: "Gray", label: "Cinza", color: "gray", icon: "default" },
      { value: "Dark Red", label: "Vermelho Escuro", color: "dark-red", icon: "x" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Todas as Cores Disponíveis</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Without Icons
 * Badges sem ícones
 */
export const WithoutIcons: Story = {
  args: {
    items: [
      { value: "45", label: "Produto A" },
      { value: "32", label: "Produto B" },
      { value: "28", label: "Produto C" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Sem Ícones</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Large Numbers
 * Números grandes
 */
export const LargeNumbers: Story = {
  args: {
    items: [
      { value: "1.2M", label: "Total de visualizações", color: "blue", icon: "calendar" },
      { value: "856K", label: "Visitantes únicos", color: "green", icon: "check" },
      { value: "45K", label: "Novos usuários", color: "purple", icon: "default" },
    ],
  },
  render: (args) => ({
    components: { UiStatusBadgeGroup },
    setup() {
      return { args };
    },
    template: `
      <div class="p-8">
        <h3 class="text-lg font-semibold text-[var(--color-text)] mb-4">Estatísticas Gerais</h3>
        <UiStatusBadgeGroup v-bind="args" />
      </div>
    `,
  }),
};
