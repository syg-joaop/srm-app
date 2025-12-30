import UiList from "../ui/UiList.vue";
import UiBadge from "../ui/UiBadge.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

/**
 * Meta configuração do componente UiList
 */
const meta: Meta<typeof UiList> = {
  title: "UI/UiList",
  component: UiList,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Lista de itens",
    },
    itemKey: {
      control: "text",
      description: "Chave única para cada item",
    },
    hoverable: {
      control: "boolean",
      description: "Efeito hover nos itens",
    },
    clickable: {
      control: "boolean",
      description: "Itens clicáveis",
    },
  },
  args: {
    items: ["Item 1", "Item 2", "Item 3"],
    itemKey: "id",
    hoverable: true,
    clickable: false,
  },
};

export default meta;
type Story = StoryObj<typeof UiList>;

/**
 * Story: Default
 * Lista simples com strings
 */
export const Default: Story = {
  args: {
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      return { args };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: With Objects
 * Lista com objetos
 */
export const WithObjects: Story = {
  args: {
    items: [
      { id: 1, name: "João Silva", email: "joao@example.com" },
      { id: 2, name: "Maria Santos", email: "maria@example.com" },
      { id: 3, name: "Pedro Costa", email: "pedro@example.com" },
    ],
    itemKey: "id",
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      return { args };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args">
          <template #item="{ item }">
            <div>
              <div class="font-semibold text-[var(--color-text)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--color-text-muted)]">{{ item.email }}</div>
            </div>
          </template>
        </UiList>
      </div>
    `,
  }),
};

/**
 * Story: Clickable
 * Lista clicável
 */
export const Clickable: Story = {
  args: {
    items: [
      { id: 1, title: "Primeira Opção", description: "Descrição da primeira opção" },
      { id: 2, title: "Segunda Opção", description: "Descrição da segunda opção" },
      { id: 3, title: "Terceira Opção", description: "Descrição da terceira opção" },
    ],
    itemKey: "id",
    clickable: true,
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      const selectedItem = ref<any>(null);
      const handleClick = (item: any) => {
        selectedItem.value = item;
      };
      return { args, selectedItem, handleClick };
    },
    template: `
      <div class="p-4 max-w-md space-y-4">
        <UiList v-bind="args" @item-click="handleClick">
          <template #item="{ item }">
            <div>
              <div class="font-semibold text-[var(--color-text)]">{{ item.title }}</div>
              <div class="text-sm text-[var(--color-text-muted)]">{{ item.description }}</div>
            </div>
          </template>
        </UiList>
        <div v-if="selectedItem" class="p-4 bg-[var(--color-hover)] rounded-lg">
          <p class="text-sm text-[var(--color-text)]">
            Selecionado: <strong>{{ selectedItem.title }}</strong>
          </p>
        </div>
      </div>
    `,
  }),
};

/**
 * Story: With Actions
 * Lista com ações
 */
export const WithActions: Story = {
  args: {
    items: [
      { id: 1, name: "Documento 1.pdf", size: "2.5 MB" },
      { id: 2, name: "Imagem.jpg", size: "1.2 MB" },
      { id: 3, name: "Apresentação.pptx", size: "5.8 MB" },
    ],
    itemKey: "id",
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      const downloadFile = (item: any) => {
        alert(`Baixando: ${item.name}`);
      };
      const deleteFile = (item: any) => {
        alert(`Deletando: ${item.name}`);
      };
      return { args, downloadFile, deleteFile };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args">
          <template #item="{ item }">
            <div>
              <div class="font-semibold text-[var(--color-text)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--color-text-muted)]">{{ item.size }}</div>
            </div>
          </template>
          <template #actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="downloadFile(item)"
                class="text-sm text-blue-500 hover:text-blue-700"
              >
                Baixar
              </button>
              <button
                @click="deleteFile(item)"
                class="text-sm text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </div>
          </template>
        </UiList>
      </div>
    `,
  }),
};

/**
 * Story: With Badges
 * Lista com badges
 */
export const WithBadges: Story = {
  args: {
    items: [
      { id: 1, name: "Tarefa 1", status: "concluído" },
      { id: 2, name: "Tarefa 2", status: "em andamento" },
      { id: 3, name: "Tarefa 3", status: "pendente" },
      { id: 4, name: "Tarefa 4", status: "cancelado" },
    ],
    itemKey: "id",
  },
  render: (args) => ({
    components: { UiList, UiBadge },
    setup() {
      const getStatusVariant = (status: string) => {
        const variants: Record<string, any> = {
          concluído: "success",
          "em andamento": "warning",
          pendente: "neutral",
          cancelado: "danger",
        };
        return variants[status] || "default";
      };
      return { args, getStatusVariant };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args">
          <template #item="{ item }">
            <div class="flex items-center justify-between w-full gap-4">
              <span class="text-[var(--color-text)]">{{ item.name }}</span>
              <UiBadge :variant="getStatusVariant(item.status)" size="small">
                {{ item.status }}
              </UiBadge>
            </div>
          </template>
        </UiList>
      </div>
    `,
  }),
};

/**
 * Story: Empty State
 * Lista vazia
 */
export const EmptyState: Story = {
  args: {
    items: [],
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      return { args };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args">
          <template #empty>
            <div class="py-8 text-center">
              <p class="text-[var(--color-text-muted)] mb-2">Nenhum item encontrado</p>
              <p class="text-sm text-[var(--color-text-muted)] opacity-60">
                Adicione itens para ver a lista
              </p>
            </div>
          </template>
        </UiList>
      </div>
    `,
  }),
};

/**
 * Story: Non Hoverable
 * Lista sem efeito hover
 */
export const NonHoverable: Story = {
  args: {
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    hoverable: false,
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      return { args };
    },
    template: `
      <div class="p-4 max-w-md">
        <UiList v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Story: Long List
 * Lista longa
 */
export const LongList: Story = {
  args: {
    items: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: `Valor ${i + 1}`,
    })),
    itemKey: "id",
  },
  render: (args) => ({
    components: { UiList },
    setup() {
      return { args };
    },
    template: `
      <div class="p-4 max-w-md max-h-96 overflow-y-auto">
        <UiList v-bind="args">
          <template #item="{ item }">
            <div>
              <div class="font-semibold text-[var(--color-text)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--color-text-muted)]">{{ item.value }}</div>
            </div>
          </template>
        </UiList>
      </div>
    `,
  }),
};
