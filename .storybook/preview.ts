import type { Preview } from '@storybook/vue3';
import '../src/assets/styles/variables.css';
import '../src/assets/styles/base.css';
import '../src/assets/styles/tailwind.css';
import './preview-head';

/**
 * Configurações globais do Storybook
 */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'light',
          value: '#f5f7fa',
        },
      ],
    },
  },

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark', icon: 'circle' },
          { value: 'light', title: 'Light', icon: 'circlehollow' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (story, context) => {
      const { theme } = context.globals;

      // Aplicar tema via data attribute
      if (typeof document !== 'undefined') {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }

      return story();
    },
  ],
};

export default preview;
