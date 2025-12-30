/**
 * Auto-imports para Vue Composition API no Storybook
 * Simula o comportamento de auto-imports do Nuxt
 */
import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick, ref as r } from 'vue';

// Declarar tipos globais para TypeScript
declare global {
  const ref: typeof r;
  const computed: typeof import('vue')['computed'];
  const reactive: typeof import('vue')['reactive'];
  const watch: typeof import('vue')['watch'];
  const onMounted: typeof import('vue')['onMounted'];
  const onUnmounted: typeof import('vue')['onUnmounted'];
  const nextTick: typeof import('vue')['nextTick'];
}

// Injetar no window para uso nos componentes
if (typeof window !== 'undefined') {
  (window as any).ref = ref;
  (window as any).computed = computed;
  (window as any).reactive = reactive;
  (window as any).watch = watch;
  (window as any).onMounted = onMounted;
  (window as any).onUnmounted = onUnmounted;
  (window as any).nextTick = nextTick;
}

export {};
