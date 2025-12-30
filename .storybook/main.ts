import type { StorybookConfig } from '@storybook/vue3-vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import type { Plugin } from 'vite';

/**
 * Plugin para injetar auto-imports do Vue (similar ao Nuxt)
 * Isso permite que componentes usem ref, computed, etc. sem importar
 */
const vueAutoImportsPlugin = (): Plugin => {
  return {
    name: 'vue-auto-imports',
    enforce: 'pre',

    transform(code, id) {
      // Aplicar apenas em arquivos .vue
      if (!/\.vue($|\?)/.test(id)) {
        return null;
      }

      // Verificar se já existe tag <script setup>
      const scriptSetupMatch = code.match(/<script\s+setup(?:\s+lang="ts")?>([\s\S]*?)<\/script>/);

      if (!scriptSetupMatch) {
        return null;
      }

      const scriptContent = scriptSetupMatch[1];
      const fullScriptTag = scriptSetupMatch[0];

      // Funções Vue para auto-import
      const vueImports = [
        'ref', 'computed', 'reactive', 'watch', 'watchEffect',
        'onMounted', 'onUnmounted', 'onBeforeMount', 'onBeforeUnmount',
        'nextTick', 'toRef', 'toRefs', 'isRef', 'unref'
      ];

      // Verificar se o código já tem essas importações
      const hasVueImports = vueImports.some(fn =>
        scriptContent.includes(`import { ${fn}`) ||
        scriptContent.includes(`import { ${fn} }`) ||
        scriptContent.includes(`from 'vue'`) ||
        scriptContent.includes(`from "vue"`)
      );

      // Se já tem importações do Vue, não fazer nada
      if (hasVueImports) {
        return null;
      }

      // Injetar as importações dentro da tag <script setup>
      const imports = `import { ${vueImports.join(', ')} } from 'vue';\n`;
      const newScriptContent = imports + scriptContent;
      const newCode = code.replace(fullScriptTag, `<script setup lang="ts">${newScriptContent}</script>`);

      return {
        code: newCode,
        map: null,
      };
    },
  };
};

/**
 * Storybook configuration for Nuxt 3 + Vue 3 + TypeScript
 */
const config: StorybookConfig = {
  stories: [
    '../src/components/storybook/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  docs: {
    autodocs: 'tag',
  },

  async viteFinal(config, { configType }) {
    // Adicionar o plugin Vue ao Vite
    config.plugins = [
      vueAutoImportsPlugin(),
      vue(),
      ...(config.plugins || []),
    ];

    // Configuração para lidar com auto-imports do Nuxt e processamento de arquivos .vue
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '~': resolve(__dirname, '../src'),
        '@': resolve(__dirname, '../src'),
        '#': resolve(__dirname, '../src'),
        '~~': resolve(__dirname, '../src'),
        '@@': resolve(__dirname, '../src'),
        'assets': resolve(__dirname, '../src/assets'),
        'public': resolve(__dirname, '../public'),
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    };

    // Adicionar configurações específicas para Vue
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'vue',
        '@storybook/vue3',
      ],
    };

    return config;
  },

  typescript: {
    reactDocgen: 'false',
  },
};

export default config;
