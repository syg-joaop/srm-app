export default defineNuxtConfig({
  ssr: false,

  srcDir: "src/",

  extends: [
    "./src/layers/auth",
    "./src/layers/dashboard",
    "./src/layers/suppliers",
    "./src/layers/team",
    "./src/layers/competitors",
    "./src/layers/prospects",
    "./src/layers/occurrences",
    "./src/layers/checkins",
  ],

  // desabilita o devtools nativo do nuxt, me ferrei pra achar isso
  devtools: { enabled: false },

  modules: [
    "@pinia/nuxt",
    "@nuxt/image",
    "nuxt-typed-router",
    "@nuxtjs/tailwindcss",
  ],

  css: [
    "~/assets/styles/variables.css",
    "~/assets/styles/base.css",
    "~/assets/styles/tailwind.css",
  ],

  imports: {
    dirs: ["composables/**", "utils/**", "stores/**"],
  },

  typescript: {
    strict: false,
    typeCheck: false,
  },

  runtimeConfig: {
    public: {
      apiSecret: process.env.API_SECRET,
      apiBaseUrl: process.env.API_LOGIN,
      apiV2Url: process.env.API_URL,
      appName: "SRM App",
      appVersion: "0.0.1",
    },
  },

  app: {
    head: {
      title: "SRM App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Sistema de Relacionamento com Fornecedores",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  nitro: {
    preset: "static",
    devProxy: {
      "/api/v1": {
        target: "https://api.sagierp.com.br/api/v1",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  compatibilityDate: "2024-11-27",
});
