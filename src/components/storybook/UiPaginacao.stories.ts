import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import UiPaginacao from '../ui/UiPaginacao.vue';

const meta: Meta<typeof UiPaginacao> = {
  title: 'UI/UiPaginacao',
  component: UiPaginacao,
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number' },
    totalPages: { control: 'number' },
    maxVisible: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof UiPaginacao>;

export const Default = {
  args: { page: 1, totalPages: 10, maxVisible: 5 },
  render: (args) => ({
    components: { UiPaginacao },
    setup() {
      const page = ref(args.page);
      return { args, page };
    },
    template: '<UiPaginacao v-bind="args" v-model:page="page" /><p class="mt-4">Página atual: {{ page }}</p>',
  }),
};

export const FewPages = {
  args: { page: 1, totalPages: 3 },
  render: (args) => ({
    components: { UiPaginacao },
    setup() {
      const page = ref(1);
      return { args, page };
    },
    template: '<UiPaginacao v-bind="args" v-model:page="page" />',
  }),
};

export const ManyPages = {
  args: { page: 5, totalPages: 50, maxVisible: 7 },
  render: (args) => ({
    components: { UiPaginacao },
    setup() {
      const page = ref(5);
      return { args, page };
    },
    template: '<UiPaginacao v-bind="args" v-model:page="page" /><p class="mt-4">Página atual: {{ page }} de {{ args.totalPages }}</p>',
  }),
};

export const FirstPage = {
  args: { page: 1, totalPages: 10 },
  render: (args) => ({
    components: { UiPaginacao },
    setup() {
      const page = ref(1);
      return { args, page };
    },
    template: '<UiPaginacao v-bind="args" v-model:page="page" />',
  }),
};

export const LastPage = {
  args: { page: 10, totalPages: 10 },
  render: (args) => ({
    components: { UiPaginacao },
    setup() {
      const page = ref(10);
      return { args, page };
    },
    template: '<UiPaginacao v-bind="args" v-model:page="page" />',
  }),
};

export const Interactive = {
  render: () => ({
    components: { UiPaginacao },
    template: `
      <div>
        <UiPaginacao :page="page" :total-pages="10" @update:page="page = $event" />
        <p class="mt-4">Você está na página <strong>{{ page }}</strong> de 10</p>
      </div>
    `,
    setup() {
      const page = ref(1);
      return { page };
    },
  }),
};
