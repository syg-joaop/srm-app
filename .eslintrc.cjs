const FEATURES = [
  "login",
  "painel",
  "fornecedores",
  "equipe",
  "concorrentes",
  "prospectos",
  "ocorrencias",
  "rotas",
  "checkin",
];

const crossFeatureZones = FEATURES.flatMap((targetFeature) =>
  FEATURES.filter((fromFeature) => fromFeature !== targetFeature).map((fromFeature) => ({
    target: `./src/layers/${targetFeature}`,
    from: `./src/layers/${fromFeature}`,
    message:
      `Evite importar de outra feature (${fromFeature}). ` +
      "Se for algo compartilhável, extraia para src/components, src/utils ou src/composables.",
  })),
);

module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  globals: {
    // Vue Composition API (auto-imported by Nuxt)
    computed: "readonly",
    ref: "readonly",
    reactive: "readonly",
    readonly: "readonly",
    watch: "readonly",
    watchEffect: "readonly",
    onMounted: "readonly",
    onUnmounted: "readonly",
    onBeforeMount: "readonly",
    onBeforeUnmount: "readonly",
    onUpdated: "readonly",
    onBeforeUpdate: "readonly",
    nextTick: "readonly",
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
    defineModel: "readonly",
    defineOptions: "readonly",
    defineSlots: "readonly",
    // Nuxt auto-imports
    useNuxtApp: "readonly",
    useRoute: "readonly",
    useRouter: "readonly",
    navigateTo: "readonly",
    useHead: "readonly",
    useSeoMeta: "readonly",
    useCookie: "readonly",
    useRequestHeaders: "readonly",
    useRequestURL: "readonly",
    useRuntimeConfig: "readonly",
    useState: "readonly",
    useFetch: "readonly",
    useLazyFetch: "readonly",
    useAsyncData: "readonly",
    useLazyAsyncData: "readonly",
    definePageMeta: "readonly",
    // Pinia
    storeToRefs: "readonly",
    defineStore: "readonly",
    // Custom composables (auto-imported from composables/**)
    useAuth: "readonly",
    useAuthPersistence: "readonly",
    useListFilter: "readonly",
    useParametros: "readonly",
    usePermissoes: "readonly",
    useTheme: "readonly",
    // Custom services (auto-imported from composables/**)
    useDashboardService: "readonly",
    useFornecedorService: "readonly",
    useProspectoService: "readonly",
    // Custom stores (auto-imported from stores/**)
    useAuthStore: "readonly",
    useDashboardStore: "readonly",
    // Utils (auto-imported from utils/**)
    useMainApi: "readonly",
    useAuthApi: "readonly",
    parseJwt: "readonly",
    isTokenExpired: "readonly",
    formatDate: "readonly",
    formatDateTime: "readonly",
    formatDayMonth: "readonly",
    formatarMoeda: "readonly",
    formatarNumero: "readonly",
    formatarKg: "readonly",
    groupBy: "readonly",
    unique: "readonly",
    sortBy: "readonly",
    capitalize: "readonly",
    truncate: "readonly",
    slugify: "readonly",
    isValidEmail: "readonly",
    isRequired: "readonly",
    minLength: "readonly",
    maxLength: "readonly",
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

    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/components",
            from: "./src/layers",
            message: "Componentes compartilhados não devem importar de features (src/layers/*).",
          },
          {
            target: "./src/composables",
            from: "./src/layers",
            message: "Composables compartilhados não devem importar de features (src/layers/*).",
          },
          {
            target: "./src/stores",
            from: "./src/layers",
            message: "Stores globais não devem importar de features (src/layers/*).",
          },
          {
            target: "./src/utils",
            from: "./src/layers",
            message: "Utils compartilhados não devem importar de features (src/layers/*).",
          },
          {
            target: "./src/types",
            from: "./src/layers",
            message: "Types compartilhados não devem importar de features (src/layers/*).",
          },
          {
            target: "./src/layouts",
            from: "./src/layers",
            message: "Layouts não devem importar direto de features (src/layers/*).",
          },
          {
            target: "./src/plugins",
            from: "./src/layers",
            message: "Plugins não devem importar direto de features (src/layers/*).",
          },
          {
            target: "./src/middleware",
            from: "./src/layers",
            message: "Middleware não deve importar direto de features (src/layers/*).",
          },
          {
            target: "./src/server",
            from: "./src/layers",
            message: "Código de server não deve importar de features (src/layers/*).",
          },
          ...crossFeatureZones,
        ],
      },
    ],
  },

  overrides: [
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
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["~/layers/**", "@/layers/**"],
                message: "Código compartilhado não deve importar de src/layers/*.",
              },
            ],
          },
        ],
      },
    },
  ],
};
