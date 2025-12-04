# Regras e Padrões do Projeto SRM

> Documentação completa para desenvolvimento e manutenção do projeto SRM App

---

## 1. Visão Geral do Projeto

### 1.1 Descrição

SRM App é uma aplicação de gestão de relacionamento com fornecedores (Supplier Relationship Management) construída com tecnologias modernas web e mobile.

### 1.2 Tecnologias Principais

- **Framework:** Nuxt 3.13.0 (Vue 3.5.24)
- **State Management:** Pinia 2.3.1
- **Estilização:** Tailwind CSS 3
- **Validação:** Zod 3.23.8
- **Gráficos:** Apache ECharts 6.0.0
- **Ícones:** Lucide Vue Next
- **TypeScript:** 5.9.3
- **Mobile/Desktop:** Capacitor 7 (Android, iOS, Electron)

### 1.3 Arquitetura

- **Tipo:** SPA (Single Page Application)
- **Renderização:** Client-side only (`ssr: false`)
- **Build:** Static generation
- **Organização:** Modular com Nuxt Layers

---

## 2. Estrutura de Pastas

### 2.1 Árvore de Diretórios

```
srm-app/
├── src/                           # Código fonte principal
│   ├── app.vue                    # Componente raiz
│   │
│   ├── assets/                    # Assets estáticos
│   │   ├── img/                   # Imagens (logos, ícones)
│   │   └── styles/                # Estilos globais
│   │       ├── variables.css      # Tokens CSS (cores, layout)
│   │       ├── base.css           # Reset e estilos base
│   │       ├── tailwind.css       # Diretivas Tailwind
│   │       └── scrollbar.css      # Scrollbar customizado
│   │
│   ├── components/                # Componentes reutilizáveis
│   │   ├── ui/                    # Sistema de Design UI
│   │   │   ├── buttons/           # UiButton
│   │   │   ├── forms/             # UiInput, UiCheckbox
│   │   │   ├── layout/            # UiCard
│   │   │   ├── data-display/      # UiBadge, UiList, UiMetric*
│   │   │   ├── feedback/          # UiSpinner, UiEmptyState
│   │   │   └── overlays/          # UiModal
│   │   ├── layout/                # Sidebar
│   │   ├── common/                # UserProfile
│   │   └── features/              # Componentes específicos de features
│   │
│   ├── composables/               # Lógica reutilizável
│   │   ├── core/                  # useAuth (facade)
│   │   ├── features/              # useAuthPersistence
│   │   └── ui/                    # useTheme
│   │
│   ├── layouts/                   # Layouts Nuxt
│   │   ├── default.vue            # Layout com sidebar/header
│   │   └── blank.vue              # Layout vazio (login)
│   │
│   ├── layers/                    # Nuxt Layers (features modulares)
│   │   ├── auth/                  # Autenticação
│   │   │   ├── components/
│   │   │   ├── composables/       # useAuth.ts
│   │   │   ├── pages/             # login.vue
│   │   │   ├── stores/            # auth.ts
│   │   │   ├── types/
│   │   │   └── nuxt.config.ts
│   │   ├── dashboard/             # Dashboard principal
│   │   │   ├── components/        # StatCard, DashboardWidget, etc
│   │   │   ├── composables/       # useDashboardService
│   │   │   ├── pages/             # index.vue
│   │   │   ├── stores/            # dashboard.ts
│   │   │   ├── types/
│   │   │   └── nuxt.config.ts
│   │   ├── suppliers/             # Fornecedores
│   │   ├── team/                  # Equipe
│   │   ├── competitors/           # Concorrentes
│   │   ├── prospects/             # Prospectos
│   │   ├── occurrences/           # Ocorrências
│   │   ├── checkins/              # Check-ins
│   │   └── routes/                # Rotas
│   │
│   ├── middleware/                # Middlewares Nuxt
│   │   └── auth.global.ts         # Proteção de rotas
│   │
│   ├── plugins/                   # Plugins Nuxt
│   │   ├── auth.client.ts         # Inicialização auth
│   │   └── echarts.client.ts      # Plugin ECharts
│   │
│   ├── server/                    # Backend Nuxt (API Proxy)
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── suppliers/
│   │   │   └── login.post.ts
│   │   ├── schemas/               # Validação Zod
│   │   │   ├── auth.schema.ts
│   │   │   ├── dashboard.schema.ts
│   │   │   └── supplier.schema.ts
│   │   ├── middleware/
│   │   └── utils/
│   │       └── api-client.ts
│   │
│   ├── types/                     # Tipos TypeScript globais
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── supplier.ts
│   │   └── index.ts
│   │
│   └── utils/                     # Funções utilitárias
│       ├── formatters/            # currency, date
│       ├── helpers/               # array, string
│       ├── validators/            # email
│       ├── api.ts
│       └── jwt.ts
│
├── public/                        # Arquivos públicos estáticos
├── .env                           # Variáveis de ambiente
├── nuxt.config.ts                 # Configuração Nuxt
├── tailwind.config.ts             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
└── package.json                   # Dependências NPM
```

### 2.2 Convenções de Organização

**Componentes:**

- `components/ui/` → Componentes do Design System (reutilizáveis)
- `components/layout/` → Componentes de layout (Sidebar, Header)
- `components/common/` → Componentes comuns entre features
- `layers/[feature]/components/` → Componentes específicos de uma feature

**Lógica:**

- `composables/` → Lógica reutilizável global
- `stores/` → Estado global (Pinia)
- `utils/` → Funções puras e helpers

**Tipos:**

- `types/` → Tipos TypeScript globais
- `layers/[feature]/types/` → Tipos específicos de feature

---

## 3. Sistema de Design e Estilos

### 3.1 Paleta de Cores

#### Tema Escuro (padrão)

```css
--color-primary: #0099ff /* Azul vibrante */ --color-primary-dark: #0077be
  /* Azul escuro (hover) */ --color-background: #0f172a /* Slate 900 */
  --color-surface: #1e293b /* Slate 800 */ --color-text: #ffffff /* Branco */
  --color-text-muted: #aaaaaa /* Cinza claro */ --color-border: #333333
  /* Cinza médio */ --color-border-subtle: rgba(255, 255, 255, 0.08)
  --color-hover: rgba(255, 255, 255, 0.1);
```

#### Tema Claro

```css
--color-background: #f5f7fa /* Cinza muito claro */ --color-surface: #ffffff
  /* Branco */ --color-text: #333333 /* Preto suave */
  --color-text-muted: #666666 /* Cinza médio */ --color-border: #e0e0e0
  /* Cinza claro */ --color-border-subtle: rgba(0, 0, 0, 0.08)
  --color-hover: rgba(0, 0, 0, 0.05);
```

#### Cores Tailwind Customizadas

```typescript
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#0099ff',
    dark: '#0077be',
  },
  background: {
    light: '#f5f7fa',
    dark: '#121212',
  },
  surface: {
    light: '#ffffff',
    dark: '#1e1e1e',
  },
  border: {
    light: '#e0e0e0',
    dark: '#333333',
  }
}
```

### 3.2 Tipografia

**Fonte:** Inter (Google Fonts)

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

font-family: "Inter", sans-serif;
```

**Pesos disponíveis:**

- 400 - Regular
- 500 - Medium
- 600 - Semibold
- 700 - Bold

**Classes Tailwind comuns:**

- `text-xs` - 0.75rem
- `text-sm` - 0.875rem
- `text-base` - 1rem
- `text-lg` - 1.125rem
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700

### 3.3 Tokens CSS (Variáveis Layout)

```css
--sidebar-width: 250px --sidebar-width-collapsed: 64px --header-height: 60px;
```

### 3.4 Sistema de Tema

**Implementação:**

- Atributo `data-theme="dark"` ou `data-theme="light"` no HTML
- Tailwind `darkMode: 'class'` strategy
- Composable `useTheme()` para gerenciamento

**Uso:**

```typescript
const { theme, toggleTheme, setTheme } = useTheme();

// Alternar tema
toggleTheme();

// Definir tema específico
setTheme("dark");
setTheme("light");
```

### 3.5 Ícones

**Biblioteca:** Lucide Vue Next (550+ ícones)

**Uso:**

```vue
<script setup>
import { Menu, User, Moon, Sun } from "lucide-vue-next";
</script>

<template>
  <Menu :size="20" />
  <User :size="24" class="text-primary" />
</template>
```

---

## 4. Componentes UI

### 4.1 Padrões de Nomenclatura

**Regras:**

- Todos os componentes UI têm prefixo `Ui`
- Usar PascalCase
- Nome descritivo da função

**Exemplos:**

- `UiButton.vue` - Botão
- `UiInput.vue` - Campo de input
- `UiCard.vue` - Card/container
- `UiBadge.vue` - Badge/tag
- `UiModal.vue` - Modal/dialog

### 4.2 Organização por Categoria

```
components/ui/
├── buttons/          # Botões e ações
├── forms/            # Inputs, checkbox, select
├── layout/           # Card, container, divider
├── data-display/     # Badge, list, table, metric
├── feedback/         # Spinner, toast, empty state
└── overlays/         # Modal, drawer, popover
```

### 4.3 Como Criar um Novo Componente UI

#### Passo 1: Criar arquivo na categoria correta

```bash
# Exemplo: criar um novo botão
src/components/ui/buttons/UiButton.vue
```

#### Passo 2: Estrutura padrão

```vue
<template>
  <button
    :class="[
      'base-button',
      variantClass,
      sizeClass,
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <UiSpinner v-if="loading" :size="16" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClass = computed(() => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-surface border border-border hover:bg-hover",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  return variants[props.variant];
});

const sizeClass = computed(() => {
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };
  return sizes[props.size];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
```

### 4.4 Props e Slots Padrão

**Props comuns:**

- `variant` - Variação visual
- `size` - Tamanho (small, medium, large)
- `disabled` - Desabilitado
- `loading` - Estado de carregamento

**Slots comuns:**

- `default` - Conteúdo principal
- `header` - Cabeçalho
- `footer` - Rodapé
- `prefix` - Ícone/conteúdo antes
- `suffix` - Ícone/conteúdo depois

### 4.5 Exemplo de Uso

```vue
<template>
  <UiButton variant="primary" size="medium" @click="handleSubmit">
    Salvar
  </UiButton>

  <UiCard title="Estatísticas" hoverable>
    <template #header>
      <div class="flex items-center gap-2">
        <BarChart :size="20" />
        <span>Vendas</span>
      </div>
    </template>

    <p>Conteúdo do card</p>

    <template #footer>
      <UiButton variant="secondary" size="small">Ver mais</UiButton>
    </template>
  </UiCard>
</template>
```

---

## 5. Arquitetura de Layers

### 5.1 O que são Nuxt Layers

Nuxt Layers são módulos autocontidos que encapsulam uma feature completa:

- Componentes
- Páginas (rotas)
- Stores (estado)
- Composables
- Tipos
- Configuração própria

**Vantagens:**

- Modularidade
- Isolamento de código
- Code splitting automático
- Reutilização entre projetos

### 5.2 Estrutura Interna de um Layer

```
layers/[feature-name]/
├── components/           # Componentes específicos da feature
├── composables/          # Lógica reutilizável da feature
├── pages/                # Rotas (file-based routing)
│   ├── index.vue         # /[feature-name]
│   └── [id].vue          # /[feature-name]/:id
├── stores/               # Pinia stores da feature
├── types/                # Tipos TypeScript
│   └── index.ts
└── nuxt.config.ts        # Configuração do layer
```

### 5.3 Como Criar um Novo Layer

#### Passo 1: Criar estrutura de pastas

```bash
mkdir -p src/layers/clientes/{components,pages,stores,types,composables}
```

#### Passo 2: Criar nuxt.config.ts do layer

```typescript
// src/layers/clientes/nuxt.config.ts
export default defineNuxtConfig({
  // Configurações específicas do layer (opcional)
});
```

#### Passo 3: Criar página principal

```vue
<!-- src/layers/clientes/pages/index.vue -->
<template>
  <div>
    <h1>Lista de Clientes</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
```

#### Passo 4: Registrar layer no nuxt.config.ts principal

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    "./src/layers/auth",
    "./src/layers/dashboard",
    "./src/layers/clientes", // Novo layer
    // ...
  ],
});
```

#### Passo 5: Criar store (se necessário)

```typescript
// src/layers/clientes/stores/clientes.ts
import { defineStore } from "pinia";

export const useClientesStore = defineStore("clientes", () => {
  const clientes = ref([]);
  const loading = ref(false);

  const fetchClientes = async () => {
    loading.value = true;
    try {
      const data = await $fetch("/api/clientes");
      clientes.value = data;
    } finally {
      loading.value = false;
    }
  };

  return {
    clientes,
    loading,
    fetchClientes,
  };
});
```

#### Passo 6: Criar tipos

```typescript
// src/layers/clientes/types/index.ts
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
}

export interface ClientesState {
  clientes: Cliente[];
  loading: boolean;
}
```

### 5.4 Quando Usar Layers vs Componentes Globais

**Use Layers quando:**

- Feature tem rotas próprias (páginas)
- Feature tem estado complexo (store dedicado)
- Feature tem múltiplos componentes relacionados
- Quer isolamento e modularidade

**Use Componentes Globais quando:**

- Componente é reutilizado em múltiplas features
- Não precisa de rotas próprias
- Faz parte do Design System (UI components)

---

## 6. Padrões de Código

### 6.1 Nomenclatura

**Componentes:**

- PascalCase: `UserProfile.vue`, `DashboardWidget.vue`
- Prefixo `Ui` para Design System: `UiButton.vue`

**Composables:**

- Prefixo `use`: `useAuth.ts`, `useTheme.ts`
- camelCase: `useDashboardService.ts`

**Stores:**

- Uso com `useXxxStore()`: `useAuthStore()`, `useDashboardStore()`
- Arquivo: camelCase ou kebab-case

**Arquivos:**

- kebab-case para arquivos de configuração: `nuxt.config.ts`
- PascalCase para componentes: `UserProfile.vue`
- camelCase para utils/helpers: `formatCurrency.ts`

**Variáveis e Funções:**

- camelCase: `userName`, `fetchData()`

**Tipos e Interfaces:**

- PascalCase: `User`, `LoginCredentials`, `DashboardState`

### 6.2 Estrutura de Componentes Vue

**Template padrão:**

```vue
<template>
  <!-- HTML do componente -->
</template>

<script setup lang="ts">
// Imports
import { ref, computed } from "vue";
import type { PropType } from "vue";

// Props
interface Props {
  title: string;
  variant?: "default" | "primary";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});

// Emits
const emit = defineEmits<{
  submit: [value: string];
  close: [];
}>();

// State
const isOpen = ref(false);

// Computed
const classes = computed(() => ({
  "variant-primary": props.variant === "primary",
}));

// Methods
const handleSubmit = () => {
  emit("submit", "value");
};

// Lifecycle (se necessário)
onMounted(() => {
  // Inicialização
});
</script>

<style scoped>
/* Estilos do componente */
</style>
```

### 6.3 TypeScript e Validação Zod

**Tipos com Zod:**

```typescript
// types/auth.ts
import { z } from "zod";

// Schema Zod
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

// Inferir tipo do schema
export type User = z.infer<typeof userSchema>;

// Validar dados
const validateUser = (data: unknown): User => {
  return userSchema.parse(data);
};
```

**Vantagens:**

- Validação em runtime
- Type safety automático
- Single source of truth

### 6.4 Composables

**Estrutura padrão:**

```typescript
// composables/ui/useModal.ts
export const useModal = () => {
  const isOpen = ref(false);

  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle,
  };
};
```

**Uso:**

```vue
<script setup>
const { isOpen, open, close } = useModal();
</script>
```

### 6.5 Stores Pinia

**Estrutura padrão (Setup Syntax):**

```typescript
// stores/produtos.ts
import { defineStore } from "pinia";

export const useProdutosStore = defineStore("produtos", () => {
  // State
  const produtos = ref<Produto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters (computed)
  const produtosAtivos = computed(() => produtos.value.filter((p) => p.ativo));

  const totalProdutos = computed(() => produtos.value.length);

  // Actions
  const fetchProdutos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch("/api/produtos");
      produtos.value = data;
    } catch (e) {
      error.value = "Erro ao carregar produtos";
    } finally {
      loading.value = false;
    }
  };

  const addProduto = (produto: Produto) => {
    produtos.value.push(produto);
  };

  return {
    // State
    produtos,
    loading,
    error,
    // Getters
    produtosAtivos,
    totalProdutos,
    // Actions
    fetchProdutos,
    addProduto,
  };
});
```

---

## 7. Estilização

### 7.1 Como Usar Variáveis CSS

**Definir variável:**

```css
/* assets/styles/variables.css */
:root {
  --color-success: #10b981;
  --spacing-card: 1rem;
}

[data-theme="light"] {
  --color-success: #059669;
}
```

**Usar variável:**

```vue
<style scoped>
.card {
  background-color: var(--color-surface);
  padding: var(--spacing-card);
  border: 1px solid var(--color-border);
}

.success-badge {
  background-color: var(--color-success);
}
</style>
```

### 7.2 Padrões de Classes Tailwind

**Layout:**

```html
<div class="flex items-center justify-between gap-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="container mx-auto px-4"></div>
  </div>
</div>
```

**Espaçamento:**

```html
<div class="p-4">
  <!-- padding: 1rem -->
  <div class="px-6 py-4">
    <!-- padding-x: 1.5rem, padding-y: 1rem -->
    <div class="mt-4 mb-2">
      <!-- margin-top: 1rem, margin-bottom: 0.5rem -->
      <div class="gap-3"><!-- gap: 0.75rem --></div>
    </div>
  </div>
</div>
```

**Cores:**

```html
<!-- Background -->
<div class="bg-surface">
  <div class="bg-primary hover:bg-primary-dark">
    <div class="bg-blue-50 dark:bg-blue-900/10">
      <!-- Text -->
      <p class="text-gray-500 dark:text-gray-400"></p>
      <h1 class="text-primary">
        <!-- Border -->
        <div class="border border-gray-200 dark:border-gray-800"></div>
      </h1>
    </div>
  </div>
</div>
```

**Tipografia:**

```html
<h1 class="text-2xl font-bold">
  <p class="text-sm text-gray-600">
    <span class="font-medium"></span>
  </p>
</h1>
```

**Arredondamento e Sombras:**

```html
<div class="rounded-lg shadow-md">
  <div class="rounded-xl shadow-sm">
    <button class="rounded-full"></button>
  </div>
</div>
```

### 7.3 Responsive Design

**Breakpoints Tailwind:**

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

**Uso:**

```html
<!-- Mobile-first approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div class="text-sm md:text-base lg:text-lg">
    <div class="hidden md:block">
      <!-- Oculto mobile, visível desktop -->
      <div class="block md:hidden"><!-- Visível mobile, oculto desktop --></div>
    </div>
  </div>
</div>
```

### 7.4 Estados (hover, active, disabled)

```html
<!-- Hover -->
<button class="bg-primary hover:bg-primary-dark hover:shadow-lg">
  <!-- Active -->
  <button class="active:scale-95">
    <!-- Focus -->
    <input class="focus:ring-2 focus:ring-primary focus:outline-none" />

    <!-- Disabled -->
    <button
      class="disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading"
    >
      <!-- Group hover -->
      <div class="group">
        <span class="group-hover:text-primary">Texto</span>
      </div>
    </button>
  </button>
</button>
```

### 7.5 Transições e Animações

**Transições CSS:**

```css
.element {
  transition: all 0.3s ease;
  /* ou */
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
```

**Classes Tailwind:**

```html
<div class="transition-all duration-300 ease-out">
  <div class="transition-colors duration-200">
    <div class="hover:scale-105 transition-transform"></div>
  </div>
</div>
```

**Animações personalizadas:**

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

---

## 8. Configurações

### 8.1 package.json

**Dependências Principais:**

```json
{
  "dependencies": {
    "nuxt": "^3.13.0",
    "vue": "^3.5.24",
    "pinia": "^2.3.1",
    "@pinia/nuxt": "^0.5.5",
    "zod": "^3.23.8",
    "echarts": "^6.0.0",
    "lucide-vue-next": "^0.554.0",
    "@capacitor/core": "^7.4.4"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.1",
    "typescript": "^5.9.3"
  }
}
```

**Scripts:**

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate"
  }
}
```

### 8.2 nuxt.config.ts

**Configurações essenciais:**

```typescript
export default defineNuxtConfig({
  ssr: false, // SPA mode
  srcDir: "src/", // Source em subdiretório

  extends: [
    // Nuxt Layers
    "./src/layers/auth",
    "./src/layers/dashboard",
    // ...
  ],

  modules: [
    // Módulos Nuxt
    "@pinia/nuxt",
    "@nuxt/image",
    "nuxt-typed-router",
    "@nuxtjs/tailwindcss",
  ],

  css: [
    // CSS Global (ordem importa!)
    "~/assets/styles/variables.css",
    "~/assets/styles/base.css",
    "~/assets/styles/tailwind.css",
  ],

  imports: {
    // Auto-imports
    dirs: ["composables/**", "utils/**", "stores/**"],
  },

  runtimeConfig: {
    // Variáveis de ambiente
    public: {
      apiBaseUrl: process.env.API_LOGIN,
      appName: "SRM App",
    },
  },
});
```

### 8.3 tailwind.config.ts

**Configuração customizada:**

```typescript
export default {
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0099ff",
          dark: "#0077be",
        },
        background: {
          light: "#f5f7fa",
          dark: "#121212",
        },
        surface: {
          light: "#ffffff",
          dark: "#1e1e1e",
        },
      },
    },
  },

  content: [
    "./src/components/**/*.{js,vue,ts}",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/layers/**/*.{js,vue,ts}",
  ],
};
```

### 8.4 Variáveis de Ambiente

**Criar arquivo .env:**

```env
API_SECRET=your-secret-key
API_LOGIN=https://api.sagierp.com.br/api/v1
API_URL=https://api.sagierp.com.br/api/v2
```

**Usar no código:**

```typescript
const config = useRuntimeConfig();
const apiUrl = config.public.apiBaseUrl;
```

---

## 9. Boas Práticas

### 9.1 DRY (Don't Repeat Yourself)

**Evite:**

```vue
<!-- ❌ Repetindo código -->
<div class="bg-white p-4 rounded-lg shadow">Card 1</div>
<div class="bg-white p-4 rounded-lg shadow">Card 2</div>
<div class="bg-white p-4 rounded-lg shadow">Card 3</div>
```

**Prefira:**

```vue
<!-- ✅ Componente reutilizável -->
<UiCard>Card 1</UiCard>
<UiCard>Card 2</UiCard>
<UiCard>Card 3</UiCard>
```

### 9.2 Single Responsibility

Cada componente/função deve ter uma única responsabilidade.

**Evite:**

```typescript
// ❌ Composable fazendo muitas coisas
const useApp = () => {
  // auth logic
  // theme logic
  // data fetching
  // ...
};
```

**Prefira:**

```typescript
// ✅ Composables separados
const useAuth = () => {
  /* auth logic */
};
const useTheme = () => {
  /* theme logic */
};
const useFetchData = () => {
  /* data fetching */
};
```

### 9.3 Type Safety

**Sempre tipar:**

```typescript
// ✅ Tipos explícitos
interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUser = async (id: number): Promise<User> => {
  const data = await $fetch<User>(`/api/users/${id}`);
  return data;
};
```

**Usar Zod para validação:**

```typescript
// ✅ Validação em runtime
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const user = userSchema.parse(data); // Type-safe!
```

### 9.4 Error Handling

**Sempre tratar erros:**

```typescript
// ✅ Try/catch com feedback
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await $fetch("/api/data");
    return data;
  } catch (e) {
    error.value = "Erro ao carregar dados";
    console.error("Fetch error:", e);
  } finally {
    loading.value = false;
  }
};
```

### 9.5 Acessibilidade

**Usar atributos ARIA:**

```html
<!-- ✅ Acessível -->
<button aria-label="Fechar modal" aria-pressed="false" @click="close">
  <X :size="20" aria-hidden="true" />
</button>

<input
  type="text"
  id="email"
  aria-required="true"
  aria-invalid="!!error"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">{{ error }}</span>
```

### 9.6 Performance

**Lazy loading de componentes:**

```typescript
// Componentes pesados
const HeavyChart = defineAsyncComponent(
  () => import("~/components/HeavyChart.vue")
);
```

**Computed ao invés de métodos:**

```typescript
// ✅ Cached
const filteredItems = computed(() => items.value.filter((item) => item.active));

// ❌ Recalculado a cada render
const getFilteredItems = () => items.value.filter((item) => item.active);
```

**v-show vs v-if:**

```html
<!-- Toggle frequente: v-show (mantém no DOM) -->
<div v-show="isVisible">
  <!-- Renderização condicional: v-if (remove do DOM) -->
  <div v-if="shouldRender"></div>
</div>
```

---

## 10. Guia Rápido

### 10.1 Como Criar um Novo Componente UI

1. Criar arquivo em `src/components/ui/[categoria]/UiNomeComponente.vue`
2. Seguir estrutura padrão (ver seção 4.3)
3. Definir props e emits com TypeScript
4. Usar variáveis Tailwindcss para estilos
5. Adicionar estados (loading, disabled, etc)
6. Documentar props e uso

### 10.2 Como Criar uma Nova Página/Feature

**Opção 1: Página simples (sem layer)**

```vue
<!-- src/pages/sobre.vue -->
<template>
  <div>
    <h1>Sobre</h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});
</script>
```

**Opção 2: Feature completa (com layer)**

1. Criar estrutura: `src/layers/minha-feature/`
2. Criar `nuxt.config.ts` no layer
3. Criar `pages/index.vue`
4. Criar store se necessário
5. Adicionar layer ao `nuxt.config.ts` principal

### 10.3 Como Adicionar um Novo Layer

```bash
# 1. Criar estrutura
mkdir -p src/layers/nova-feature/{components,pages,stores,types}

# 2. Criar nuxt.config.ts
echo "export default defineNuxtConfig({})" > src/layers/nova-feature/nuxt.config.ts

# 3. Criar página
touch src/layers/nova-feature/pages/index.vue

# 4. Registrar no nuxt.config.ts principal
# extends: ['./src/layers/nova-feature', ...]
```

### 10.4 Como Estilizar Seguindo o Design System

**Checklist:**

- [ ] Usar variáveis tailwindcss para cores: `var(--color-primary)`
- [ ] Usar classes Tailwind para layout: `flex`, `grid`, `gap-4`
- [ ] Seguir paleta de cores do tema
- [ ] Adicionar suporte a dark mode: `dark:bg-surface`
- [ ] Usar transições: `transition-all duration-300`
- [ ] Estados hover/focus: `hover:bg-hover`, `focus:ring-2`
- [ ] Responsive: `md:grid-cols-2`, `lg:text-lg`
- [ ] Acessibilidade: `aria-label`, `role`

**Exemplo completo:**

```vue
<template>
  <div class="card-container">
    <h2 class="card-title">{{ title }}</h2>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<style scoped>
.card-container {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card-container:hover {
  background-color: var(--color-hover);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-content {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
```

---

## 11. Referências Rápidas

### 11.1 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar dev server
npm run dev:host         # Dev server acessível via rede

# Build
npm run build            # Build de produção
npm run generate         # Geração estática

# Desktop
npm run electron:dev     # Electron dev
npm run electron:build   # Electron build
```

### 11.2 Imports Comuns

```typescript
// Vue
import { ref, computed, onMounted, watch } from "vue";

// Nuxt
import { navigateTo, useRoute, useRouter } from "#app";

// Pinia
import { defineStore, storeToRefs } from "pinia";

// Ícones
import { Menu, User, Settings } from "lucide-vue-next";

// Componentes UI (auto-importados)
// <UiButton>, <UiCard>, <UiInput>
```

### 11.3 Atalhos de Desenvolvimento

**Estrutura de arquivo novo:**

```vue
<template>
  <div></div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```

**Store novo:**

```typescript
import { defineStore } from "pinia";

export const useXxxStore = defineStore("xxx", () => {
  const state = ref();
  const getter = computed(() => state.value);
  const action = () => {};

  return { state, getter, action };
});
```

**Composable novo:**

```typescript
export const useXxx = () => {
  const state = ref();
  const method = () => {};

  return { state, method };
};
```

---

## Conclusão

Este documento deve ser consultado sempre que:

- Criar novos componentes
- Adicionar novas features
- Estilizar elementos
- Configurar o projeto
- Onboarding de novos desenvolvedores

Mantenha este arquivo atualizado conforme o projeto evolui.

**Última atualização:** 2025-12-03
