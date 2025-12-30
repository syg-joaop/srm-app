/**
 * Decorators reutilizáveis para stories do Storybook
 */

import type { Decorator } from '@storybook/vue3';
import { h, onMounted, onUnmounted, ref } from 'vue';

// ============================================
// THEME DECORATOR
// ============================================

/**
 * Decorator para aplicar tema dark/light via data-attribute
 * Útil para componentes que precisam detectar o tema
 */
export const withTheme: Decorator = (story, context) => {
  const { theme } = context.globals;

  if (typeof document !== 'undefined') {
    // Aplicar tema via data attribute
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  return {
    setup() {
      return () => h('div', { class: 'story-theme-wrapper' }, [story()]);
    },
  };
};

// ============================================
// FIXED HEIGHT DECORATOR
// ============================================

/**
 * Decorator para componentes que precisam de altura fixa
 * Útil para mapas, gráficos, componentes scrollable
 */
export const withFixedHeight = (height: string): Decorator => (story) => {
  return {
    setup() {
      const style = {
        height,
        width: '100%',
        position: 'relative' as const,
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// TELEPORT SUPPORT DECORATOR
// ============================================

/**
 * Decorator para componentes que usam Teleport
 * Garante que elemento body tenha padding para não cortar dropdowns/modais
 */
export const withTeleportSupport: Decorator = (story) => {
  return {
    setup() {
      onMounted(() => {
        // Adicionar padding ao body para não cortar dropdowns
        if (typeof document !== 'undefined' && document.body) {
          document.body.style.padding = '100px';
          document.body.style.minHeight = '100vh';
        }
      });

      onUnmounted(() => {
        // Remover padding ao desmontar
        if (typeof document !== 'undefined' && document.body) {
          document.body.style.padding = '';
          document.body.style.minHeight = '';
        }
      });

      const containerStyle = {
        position: 'relative' as const,
        minHeight: '600px',
        padding: '40px',
      };

      return () => h('div', { style: containerStyle }, [story()]);
    },
  };
};

// ============================================
// PADDING DECORATOR
// ============================================

/**
 * Decorator para adicionar padding ao redor do componente
 * Útil para componentes que precisam de espaço
 */
export const withPadding = (padding: string = '40px'): Decorator => (story) => {
  return {
    setup() {
      const style = { padding };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// CENTER DECORATOR
// ============================================

/**
 * Decorator para centralizar o componente
 * Útil para componentes pequenos
 */
export const withCenter: Decorator = (story) => {
  return {
    setup() {
      const style = {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        minHeight: '100vh',
        padding: '40px',
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// BACKGROUND COLOR DECORATOR
// ============================================

/**
 * Decorator para aplicar cor de fundo específica
 * Útil para testar componentes em diferentes backgrounds
 */
export const withBackground = (color: string): Decorator => (story) => {
  return {
    setup() {
      const style = {
        backgroundColor: color,
        padding: '40px',
        minHeight: '400px',
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// GRID BACKGROUND DECORATOR
// ============================================

/**
 * Decorator para adicionar grid de fundo
 * Útil para alinhar componentes e verificar espaçamentos
 */
export const withGridBackground: Decorator = (story) => {
  return {
    setup() {
      const style = {
        backgroundColor: '#f5f5f5',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        padding: '40px',
        minHeight: '400px',
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// BORDER DECORATOR
// ============================================

/**
 * Decorator para adicionar borda ao redor do componente
 * Útil para visualizar limites do componente
 */
export const withBorder = (color: string = 'red', width: string = '2px'): Decorator => (story) => {
  return {
    setup() {
      const style = {
        border: `${width} solid ${color}`,
        display: 'inline-block' as const,
        padding: '20px',
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// RESPONSIVE DECORATOR
// ============================================

/**
 * Decorator para testar responsividade
 * Permite escolher largura do container
 */
export const withResponsive = (width: string): Decorator => (story) => {
  return {
    setup() {
      const containerStyle = {
        width,
        border: '1px dashed #ccc',
        padding: '20px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
      };

      return () => h('div', { style: containerStyle }, [story()]);
    },
  };
};

// ============================================
// SCROLLABLE DECORATOR
// ============================================

/**
 * Decorator para adicionar scroll ao container
 * Útil para testar componentes com muito conteúdo
 */
export const withScrollable = (height: string = '400px'): Decorator => (story) => {
  return {
    setup() {
      const style = {
        height,
        overflowY: 'auto' as const,
        border: '1px solid #ccc',
        padding: '20px',
        backgroundColor: '#fff',
      };

      return () => h('div', { style }, [story()]);
    },
  };
};

// ============================================
// DARK MODE DECORATOR
// ============================================

/**
 * Decorator para forçar dark mode
 */
export const withDarkMode: Decorator = (story) => {
  if (typeof document !== 'undefined') {
    document.documentElement.removeAttribute('data-theme');
  }

  return {
    setup() {
      return () => h('div', { class: 'dark-mode-story' }, [story()]);
    },
  };
};

// ============================================
// LIGHT MODE DECORATOR
// ============================================

/**
 * Decorator para forçar light mode
 */
export const withLightMode: Decorator = (story) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  return {
    setup() {
      return () => h('div', { class: 'light-mode-story' }, [story()]);
    },
  };
};

// ============================================
// LOADING STATE DECORATOR
// ============================================

/**
 * Decorator para demonstrar estado de loading
 * Adiciona um overlay com spinner
 */
export const withLoadingState: Decorator = (story) => {
  return {
    setup() {
      const isLoading = ref(true);

      // Simular carregamento
      setTimeout(() => {
        isLoading.value = false;
      }, 2000);

      const overlayStyle = {
        position: 'absolute' as const,
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        fontSize: '14px',
        zIndex: 9999,
      };

      const containerStyle = {
        position: 'relative' as const,
        minHeight: '200px',
      };

      return () =>
        h('div', { style: containerStyle }, [
          story(),
          isLoading.value && h('div', { style: overlayStyle }, ['Loading...']),
        ]);
    },
  };
};

// ============================================
// ERROR STATE DECORATOR
// ============================================

/**
 * Decorator para demonstrar estado de erro
 * Adiciona um banner de erro acima do componente
 */
export const withErrorState = (errorMessage: string = 'Erro ao carregar dados'): Decorator => (story) => {
  return {
    setup() {
      const errorStyle = {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        padding: '12px 16px',
        marginBottom: '16px',
        borderRadius: '4px',
        fontSize: '14px',
      };

      return () =>
        h('div', {}, [
          h('div', { style: errorStyle }, [errorMessage]),
          story(),
        ]);
    },
  };
};

// ============================================
// LABEL DECORATOR
// ============================================

/**
 * Decorator para adicionar label/descrição acima do componente
 * Útil para documentar exemplos
 */
export const withLabel = (text: string): Decorator => (story) => {
  return {
    setup() {
      const labelStyle = {
        fontSize: '14px',
        fontWeight: 'bold' as const,
        marginBottom: '12px',
        color: '#666',
      };

      const containerStyle = {
        marginBottom: '24px',
      };

      return () =>
        h('div', { style: containerStyle }, [
          h('div', { style: labelStyle }, [text]),
          story(),
        ]);
    },
  };
};

// ============================================
// COMBINED DECORATORS
// ============================================

/**
 * Combina múltiplos decorators
 */
export function combineDecorators(...decorators: Decorator[]): Decorator {
  return (story, context) => {
    return decorators.reduce((acc, decorator) => decorator(acc, context), story);
  };
};

// ============================================
// COMMON PRESETS
// ============================================

/**
 * Decorator padrão para mapas (altura fixa + tema)
 */
export const forMap = combineDecorators(withFixedHeight('500px'), withTheme);

/**
 * Decorator padrão para modais (teleport + padding)
 */
export const forModal = combineDecorators(withTeleportSupport, withTheme);

/**
 * Decorator padrão para selects/dropdowns (teleport)
 */
export const forDropdown = withTeleportSupport;

/**
 * Decorator padrão para componentes centrados
 */
export const forCentered = combineDecorators(withCenter, withTheme);
