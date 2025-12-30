import UiModal from "../ui/UiModal.vue";
import UiButton from "../ui/UiButton.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

/**
 * Meta configuração do componente UiModal
 */
const meta: Meta<typeof UiModal> = {
  title: "UI/UiModal",
  component: UiModal,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "boolean",
      description: "Controla visibilidade da modal",
    },
    title: {
      control: "text",
      description: "Título da modal",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large", "full"],
      description: "Tamanho da modal",
    },
    showClose: {
      control: "boolean",
      description: "Mostrar botão de fechar",
    },
    closeOnOverlay: {
      control: "boolean",
      description: "Fechar ao clicar fora",
    },
  },
  args: {
    modelValue: true,
    title: "Título da Modal",
    size: "medium",
    showClose: true,
    closeOnOverlay: true,
  },
};

export default meta;
type Story = StoryObj<typeof UiModal>;

/**
 * Story: Default
 * Modal com configuração padrão
 */
export const Default: Story = {
  args: {
    modelValue: true,
    title: "Exemplo de Modal",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      const openModal = () => {
        isOpen.value = true;
      };
      return { args, isOpen, openModal };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <p class="text-[var(--color-text)]">
            Este é um exemplo de modal com configuração padrão. Você pode fechar esta modal
            clicando no botão X ou clicando fora da modal.
          </p>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: Small
 * Modal pequena
 */
export const Small: Story = {
  args: {
    modelValue: true,
    title: "Modal Pequena",
    size: "small",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal Pequena</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <p class="text-[var(--color-text)]">
            Esta é uma modal pequena, ideal para mensagens curtas ou confirmações simples.
          </p>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: Large
 * Modal grande
 */
export const Large: Story = {
  args: {
    modelValue: true,
    title: "Modal Grande",
    size: "large",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal Grande</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-[var(--color-text)]">Conteúdo Expandido</h3>
            <p class="text-[var(--color-text)]">
              Esta é uma modal grande, adequada para conteúdo mais extenso como formulários
              complexos, tabelas ou documentação.
            </p>
            <p class="text-[var(--color-text)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <ul class="list-disc list-inside text-[var(--color-text)] space-y-2">
              <li>Primeiro item da lista</li>
              <li>Segundo item da lista</li>
              <li>Terceiro item da lista</li>
            </ul>
          </div>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: Full Screen
 * Modal em tela cheia
 */
export const FullScreen: Story = {
  args: {
    modelValue: true,
    title: "Modal Tela Cheia",
    size: "full",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal Tela Cheia</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <div class="h-full flex items-center justify-center">
            <p class="text-xl text-[var(--color-text)]">
              Esta modal ocupa quase toda a tela, ideal para visualização de conteúdo
              extenso ou experiências imersivas.
            </p>
          </div>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: With Footer
 * Modal com footer e ações
 */
export const WithFooter: Story = {
  args: {
    modelValue: true,
    title: "Confirmar Ação",
    size: "small",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal com Footer</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <p class="text-[var(--color-text)] mb-4">
            Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
          </p>
          <template #footer>
            <UiButton variant="neutral" @click="isOpen = false">Cancelar</UiButton>
            <UiButton variant="primary" @click="isOpen = false">Confirmar</UiButton>
          </template>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: No Close Button
 * Modal sem botão de fechar
 */
export const NoCloseButton: Story = {
  args: {
    modelValue: true,
    title: "Modal sem Botão Fechar",
    showClose: false,
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal sem X</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <p class="text-[var(--color-text)]">
            Esta modal não tem botão de fechar. O usuário deve fechar clicando fora
            da modal ou através de uma ação no conteúdo.
          </p>
          <div class="mt-4">
            <UiButton @click="isOpen = false">Fechar</UiButton>
          </div>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: No Overlay Close
 * Modal que não fecha ao clicar fora
 */
export const NoOverlayClose: Story = {
  args: {
    modelValue: true,
    title: "Modal Modal",
    closeOnOverlay: false,
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal Modal</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <p class="text-[var(--color-text)]">
            Esta modal não fecha ao clicar fora. O usuário deve fechar explicitamente
            através do botão X ou de uma ação no conteúdo.
          </p>
          <div class="mt-4">
            <UiButton @click="isOpen = false">Entendi</UiButton>
          </div>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: Custom Title Slot
 * Modal com título customizado
 */
export const CustomTitleSlot: Story = {
  args: {
    modelValue: true,
    size: "medium",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal com Título Customizado</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <template #title>
            <div class="flex items-center gap-2">
              <span class="text-2xl">🎉</span>
              <span>Título com Emoji!</span>
            </div>
          </template>
          <p class="text-[var(--color-text)]">
            Você pode usar o slot title para criar títulos completamente customizados,
            com emojis, ícones ou qualquer outro elemento.
          </p>
        </UiModal>
      </div>
    `,
  }),
};

/**
 * Story: Long Content
 * Modal com conteúdo longo (scroll)
 */
export const LongContent: Story = {
  args: {
    modelValue: true,
    title: "Termos de Uso",
    size: "medium",
  },
  render: (args) => ({
    components: { UiModal, UiButton },
    setup() {
      const isOpen = ref(true);
      const paragraphs = Array.from({ length: 20 }, (_, i) => `Parágrafo ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);
      return { args, isOpen, paragraphs };
    },
    template: `
      <div>
        <UiButton @click="isOpen = true">Abrir Modal com Conteúdo Longo</UiButton>
        <UiModal v-bind="args" v-model="isOpen">
          <div class="space-y-3">
            <p v-for="(para, index) in paragraphs" :key="index" class="text-[var(--color-text)]">
              {{ para }}
            </p>
          </div>
          <template #footer>
            <UiButton variant="neutral" @click="isOpen = false">Fechar</UiButton>
            <UiButton variant="primary" @click="isOpen = false">Aceitar</UiButton>
          </template>
        </UiModal>
      </div>
    `,
  }),
};
