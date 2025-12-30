import { addons } from '@storybook/preview-api';
import { create } from '@storybook/theming';

/*
 * Configuração visual do Storybook Manager
 */
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'SRM App - Component Library',
    brandUrl: 'https://sagierp.com.br',
    brandImage: '/favicon.ico',
    fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
});
