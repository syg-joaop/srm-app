import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed } from 'vue';
import UiDateBox from '../ui/UiDateBox.vue';

const meta: Meta<typeof UiDateBox> = {
  title: 'UI/UiDateBox',
  component: UiDateBox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Rótulo do dia/mês',
    },
    variant: {
      control: 'select',
      options: ['default', 'danger', 'warning'],
      description: 'Variante de cor',
    },
  },
  args: {
    label: '',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof UiDateBox>;

export const Default: Story = {
  render: (args) => ({
    components: { UiDateBox },
    setup() {
      return { args };
    },
    template: '<UiDateBox v-bind="args">25</UiDateBox>',
  }),
};

export const WithLabel: Story = {
  args: {
    label: 'DEZ',
  },
  render: (args) => ({
    components: { UiDateBox },
    setup() {
      return { args };
    },
    template: '<UiDateBox v-bind="args">25</UiDateBox>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { UiDateBox },
    template: `
      <div class="flex gap-3">
        <UiDateBox label="JAN" variant="default">15</UiDateBox>
        <UiDateBox label="FEV" variant="danger">20</UiDateBox>
        <UiDateBox label="MAR" variant="warning">25</UiDateBox>
      </div>
    `,
  }),
};

export const WeekDays: Story = {
  render: () => ({
    components: { UiDateBox },
    template: `
      <div class="flex gap-2">
        <UiDateBox label="SEG">15</UiDateBox>
        <UiDateBox label="TER">16</UiDateBox>
        <UiDateBox label="QUA">17</UiDateBox>
        <UiDateBox label="QUI">18</UiDateBox>
        <UiDateBox label="SEX">19</UiDateBox>
        <UiDateBox label="SÁB">20</UiDateBox>
        <UiDateBox label="DOM">21</UiDateBox>
      </div>
    `,
  }),
};

export const DateRange: Story = {
  render: () => ({
    components: { UiDateBox },
    template: `
      <div>
        <div class="flex gap-2 mb-4">
          <UiDateBox label="DEZ">15</UiDateBox>
          <UiDateBox label="DEZ">16</UiDateBox>
          <UiDateBox label="DEZ" variant="danger">17</UiDateBox>
          <UiDateBox label="DEZ">18</UiDateBox>
          <UiDateBox label="DEZ">19</UiDateBox>
        </div>

        <div class="flex gap-2">
          <UiDateBox label="DEZ">20</UiDateBox>
          <UiDateBox label="DEZ">21</UiDateBox>
          <UiDateBox label="DEZ">22</UiDateBox>
          <UiDateBox label="DEZ">23</UiDateBox>
          <UiDateBox label="DEZ">24</UiDateBox>
        </div>
      </div>
    `,
  }),
};

export const DeliverySchedule: Story = {
  render: () => ({
    components: { UiDateBox },
    template: `
      <div>
        <h4 style="margin-bottom: 12px;">Agendar Entrega</h4>
        <div class="flex gap-2 flex-wrap">
          <UiDateBox label="SEG">02</UiDateBox>
          <UiDateBox label="TER">03</UiDateBox>
          <UiDateBox label="QUA">04</UiDateBox>
          <UiDateBox label="QUI" variant="warning">05</UiDateBox>
          <UiDateBox label="SEX">06</UiDateBox>
        </div>
      </div>
    `,
  }),
};

export const AvailableDates: Story = {
  render: () => ({
    components: { UiDateBox },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 0.9rem;">Datas disponíveis para entrega:</p>
        <div class="flex gap-2 flex-wrap">
          <UiDateBox label="JAN">10</UiDateBox>
          <UiDateBox label="JAN">11</UiDateBox>
          <UiDateBox label="JAN" variant="danger">12</UiDateBox>
          <UiDateBox label="JAN">13</UiDateBox>
          <UiDateBox label="JAN">14</UiDateBox>
          <UiDateBox label="JAN">15</UiDateBox>
        </div>

        <div style="margin-top: 16px; font-size: 0.8rem; opacity: 0.7;">
          <div class="flex items-center gap-2 mb-1">
            <div style="width: 12px; height: 12px; border-radius: 2px; background: var(--color-primary);"></div>
            <span>Disponível</span>
          </div>
          <div class="flex items-center gap-2">
            <div style="width: 12px; height: 12px; border-radius: 2px; background: var(--color-danger);"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    `,
  }),
};
