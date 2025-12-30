/**
 * Composable para detectar breakpoint de desktop/mobile.
 * Reutilizável em qualquer componente que precise de responsividade.
 */
export const useBreakpoint = (breakpoint = 768) => {
  const isDesktop = ref(false);

  const checkBreakpoint = () => {
    isDesktop.value = window.innerWidth >= breakpoint;
  };

  onMounted(() => {
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkBreakpoint);
  });

  return {
    isDesktop,
    checkBreakpoint,
  };
};
