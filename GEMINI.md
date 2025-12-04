# Project Context: SRM App

## Overview
**SRM App (Sistema de Relacionamento com Fornecedores)** is a modern Supplier Relationship Management application built with **Nuxt 3** (Vue 3), **TypeScript**, and **Electron** (via Capacitor). It uses a **Feature-Sliced Design** (FSD) architecture, leveraging Nuxt Layers to modularize the codebase by domain.

## Tech Stack
- **Framework:** Nuxt 3.13.0 (SPA mode `ssr: false`)
- **Runtime:** Node.js / Electron (Capacitor Community Electron)
- **Language:** TypeScript 5.9.3
- **State Management:** Pinia 3.0.4
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Validation:** Zod
- **UI Components:** Lucide Vue Next (Icons), ECharts
- **Build Tool:** Vite (internal to Nuxt) / Electron Builder

## Architecture & Directory Structure
The project follows a modular architecture using Nuxt Layers.

### `src/`
The source directory is explicitly set to `src/` in `nuxt.config.ts`.

- **`src/layers/`**: Contains the feature modules (domains). Each layer is effectively a mini-Nuxt app or a config extension.
    - `auth/`: Authentication logic and views.
    - `dashboard/`: Main dashboard.
    - `suppliers/`: Supplier management.
    - `team/`, `competitors/`, `prospects/`, `occurrences/`, `checkins/`: Other domain modules.
- **`src/assets/`**: Global assets (images, styles).
    - `styles/`: Global CSS, including `tailwind.css`, `variables.css` (CSS variables), and `base.css`.
- **`src/components/`**: Shared UI components (Atomic Design inspired).
- **`src/composables/`**: Shared logic/hooks.
- **`src/layouts/`**: App layouts (`default.vue`, `blank.vue`).
- **`src/plugins/`**: Client-side plugins (e.g., ECharts).
- **`src/utils/`**: Helper functions.
- **`electron/`**: Electron-specific main process code and configuration.

## Development Workflow

### Prerequisite
Ensure `Node.js` is installed.

### Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Install Deps** | `npm install` | Install project dependencies. |
| **Web Dev** | `npm run dev` | Start Nuxt dev server (http://localhost:3000). |
| **Web Build** | `npm run generate` | Generate static site for production/Electron. |
| **Electron Dev** | `npm run electron:dev` | Start Nuxt dev server + Electron window. |
| **Electron Build** | `npm run electron:build` | Build the final Electron executable. |

## Conventions & Best Practices

### Code Style
- **Vue 3 Composition API:** Use `<script setup lang="ts">`.
- **Auto-Imports:** Nuxt auto-imports top-level `composables`, `utils`, and `components`. Do not manually import them unless necessary (e.g., naming conflicts).
- **Layers:**
    - New domain features should be added as a new directory in `src/layers/` and registered in `nuxt.config.ts` under `extends`.
    - Layers can have their own `nuxt.config.ts`, `pages/`, `components/`, `composables/`, etc.

### State Management (Pinia)
- Stores are defined in `stores/` directories (either globally or within layers).
- Use the setup syntax for stores (`defineStore('id', () => { ... })`).

### Styling
- Use **Tailwind CSS** classes for layout and utilities.
- Use CSS Variables defined in `src/assets/styles/variables.css` for theming (colors, etc.).

### Validation
- Use **Zod** for schema validation, especially for API responses and forms.
- `h3-zod` is available for server-side validation if needed (though this is largely an SPA).

## Key Configuration Files
- `nuxt.config.ts`: Main Nuxt configuration. Defines layers, modules, and build settings.
- `package.json`: Scripts and dependencies.
- `electron/package.json`: Electron specific dependencies and build scripts.
- `electron/src/index.ts`: Electron main process entry point.
- `tailwind.config.ts`: Tailwind configuration.
