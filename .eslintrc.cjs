module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2022,
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },

  plugins: ["vue", "@typescript-eslint", "import"],

  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],

  rules: {
    // no-undef será desabilitado apenas para arquivos TypeScript/Vue nos overrides
    // Para arquivos JS, mantemos a verificação padrão

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],

    "vue/multi-word-component-names": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",

    // Organização de imports
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // External libraries
          "internal", // Internal modules (usando ~ ou @)
          "parent", // Parent imports
          "sibling", // Sibling imports
          "index", // Index imports
          "type", // Type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "~/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "*.vue",
            group: "sibling",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["type"],
      },
    ],
    "import/newline-after-import": "warn",
    "import/no-duplicates": "warn",
  },

  overrides: [
    {
      // Para arquivos TypeScript e Vue, desabilita no-undef
      // O TypeScript já faz essa verificação e conhece todos os auto-imports do Nuxt
      // através do tsconfig.json que estende .nuxt/tsconfig.json
      files: ["**/*.{ts,vue}"],
      rules: {
        "no-undef": "off",
      },
    },
    {
      files: ["src/utils/logger.ts"],
      rules: {
        "no-console": "off",
        "no-debugger": "off",
      },
    },
    {
      // Para arquivos JavaScript puros (.js, .cjs), ainda precisamos de no-undef
      // já que não têm verificação de tipos do TypeScript
      files: ["**/*.{js,cjs,mjs}"],
      rules: {
        "no-undef": "error",
      },
    },
    {
      files: ["src/layers/**/*.{ts,vue}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["~/layers/**", "@/layers/**"],
                message:
                  "Dentro de um layer, prefira imports relativos e não dependa de outras features.",
              },
            ],
          },
        ],
      },
    },
    {
      files: [
        "src/components/**/*.{ts,vue}",
        "src/composables/**/*.{ts,vue}",
        "src/stores/**/*.{ts,vue}",
        "src/utils/**/*.{ts,vue}",
        "src/types/**/*.{ts,vue}",
        "src/layouts/**/*.{ts,vue}",
        "src/plugins/**/*.{ts,vue}",
        "src/middleware/**/*.{ts,vue}",
        "src/server/**/*.{ts,vue}",
        "src/app.vue",
      ],
    },
  ],
};
