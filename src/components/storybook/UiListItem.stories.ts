import UiListItem from "../ui/UiListItem.vue";
import UiBadge from "../ui/UiBadge.vue";

import type { Meta, StoryObj } from "@storybook/vue3";
import { User, Mail, Phone, MapPin, MoreVertical } from "lucide-vue-next";

/**
 * Meta configuração do componente UiListItem
 */
const meta: Meta<typeof UiListItem> = {
  title: "UI/UiListItem",
  component: UiListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UiListItem>;

/**
 * Story: Default
 * Item de lista simples
 */
export const Default: Story = {
  render: () => ({
    components: { UiListItem },
    template: `
      <div class="p-4 max-w-md">
        <UiListItem>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Título do Item</div>
            <div class="text-sm text-[var(--color-text-muted)]">Descrição do item</div>
          </div>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: With Leading Icon
 * Item com ícone à esquerda
 */
export const WithLeadingIcon: Story = {
  render: () => ({
    components: { UiListItem },
    setup() {
      return { User };
    },
    template: `
      <div class="p-4 max-w-md space-y-2">
        <UiListItem>
          <template #leading>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User class="w-5 h-5 text-blue-600" />
            </div>
          </template>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">João Silva</div>
            <div class="text-sm text-[var(--color-text-muted)]">joao@example.com</div>
          </div>
        </UiListItem>

        <UiListItem>
          <template #leading>
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User class="w-5 h-5 text-green-600" />
            </div>
          </template>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Maria Santos</div>
            <div class="text-sm text-[var(--color-text-muted)]">maria@example.com</div>
          </div>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: With Action
 * Item com botão de ação
 */
export const WithAction: Story = {
  render: () => ({
    components: { UiListItem },
    setup() {
      return { MoreVertical };
    },
    template: `
      <div class="p-4 max-w-md space-y-2">
        <UiListItem>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Arquivo.pdf</div>
            <div class="text-sm text-[var(--color-text-muted)]">2.5 MB • Modificado há 2 horas</div>
          </div>
          <template #action>
            <button class="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors">
              <MoreVertical class="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </template>
        </UiListItem>

        <UiListItem>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Imagem.jpg</div>
            <div class="text-sm text-[var(--color-text-muted)]">1.2 MB • Modificado ontem</div>
          </div>
          <template #action>
            <button class="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors">
              <MoreVertical class="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </template>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: With Badge
 * Item com badge
 */
export const WithBadge: Story = {
  render: () => ({
    components: { UiListItem, UiBadge },
    template: `
      <div class="p-4 max-w-md space-y-2">
        <UiListItem>
          <div class="flex-1">
            <div class="font-semibold text-[var(--color-text)]">Tarefa 1</div>
            <div class="text-sm text-[var(--color-text-muted)]">Atualizar documentação</div>
          </div>
          <template #action>
            <UiBadge variant="success">Concluído</UiBadge>
          </template>
        </UiListItem>

        <UiListItem>
          <div class="flex-1">
            <div class="font-semibold text-[var(--color-text)]">Tarefa 2</div>
            <div class="text-sm text-[var(--color-text-muted)]">Revisar código</div>
          </div>
          <template #action>
            <UiBadge variant="warning">Em andamento</UiBadge>
          </template>
        </UiListItem>

        <UiListItem>
          <div class="flex-1">
            <div class="font-semibold text-[var(--color-text)]">Tarefa 3</div>
            <div class="text-sm text-[var(--color-text-muted)]">Criar testes</div>
          </div>
          <template #action>
            <UiBadge variant="neutral">Pendente</UiBadge>
          </template>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: Contact List
 * Lista de contatos completa
 */
export const ContactList: Story = {
  render: () => ({
    components: { UiListItem },
    setup() {
      return { User, Mail, Phone, MapPin };
    },
    template: `
      <div class="p-4 max-w-md space-y-2">
        <UiListItem>
          <template #leading>
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              JS
            </div>
          </template>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">João Silva</div>
            <div class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Mail class="w-3 h-3" />
              <span>joao@example.com</span>
            </div>
          </div>
        </UiListItem>

        <UiListItem>
          <template #leading>
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
              MS
            </div>
          </template>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Maria Santos</div>
            <div class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Phone class="w-3 h-3" />
              <span>(11) 98765-4321</span>
            </div>
          </div>
        </UiListItem>

        <UiListItem>
          <template #leading>
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
              PC
            </div>
          </template>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Pedro Costa</div>
            <div class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <MapPin class="w-3 h-3" />
              <span>São Paulo, SP</span>
            </div>
          </div>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: With Multiple Actions
 * Item com múltiplas ações
 */
export const WithMultipleActions: Story = {
  render: () => ({
    components: { UiListItem },
    template: `
      <div class="p-4 max-w-md space-y-2">
        <UiListItem>
          <div class="text-[var(--color-text)]">
            <div class="font-semibold">Projeto Alpha</div>
            <div class="text-sm text-[var(--color-text-muted)]">Última atualização: 2 horas atrás</div>
          </div>
          <template #action>
            <div class="flex gap-2">
              <button class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Editar
              </button>
              <button class="px-3 py-1.5 text-sm bg-[var(--color-hover)] text-[var(--color-text)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                Arquivar
              </button>
            </div>
          </template>
        </UiListItem>
      </div>
    `,
  }),
};

/**
 * Story: Dense List
 * Lista densa (compacta)
 */
export const DenseList: Story = {
  render: () => ({
    components: { UiListItem },
    template: `
      <div class="p-4 max-w-md">
        <p class="text-sm text-[var(--color-text-muted)] mb-2">Lista densa com muitas opções</p>
        <div class="space-y-0.5">
          <UiListItem>
            <div class="text-sm text-[var(--color-text)]">Opção 1</div>
          </UiListItem>
          <UiListItem>
            <div class="text-sm text-[var(--color-text)]">Opção 2</div>
          </UiListItem>
          <UiListItem>
            <div class="text-sm text-[var(--color-text)]">Opção 3</div>
          </UiListItem>
          <UiListItem>
            <div class="text-sm text-[var(--color-text)]">Opção 4</div>
          </UiListItem>
          <UiListItem>
            <div class="text-sm text-[var(--color-text)]">Opção 5</div>
          </UiListItem>
        </div>
      </div>
    `,
  }),
};
