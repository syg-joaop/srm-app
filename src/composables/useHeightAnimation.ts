/**
 * Composable para animações de altura (expand/collapse).
 * Reutilizável em qualquer componente que precisa de animações suaves de altura.
 */

export const useHeightAnimation = () => {
  /**
   * Configura elemento antes de entrar (height = 0, opacity = 0)
   */
  const beforeEnter = (el: HTMLElement) => {
    el.style.height = '0';
    el.style.opacity = '0';
  };

  /**
   * Anima entrada do elemento (height para scrollHeight, opacity para 1)
   */
  const enter = (el: HTMLElement) => {
    el.style.transition = 'height 250ms ease-out, opacity 250ms ease-out';
    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + 'px';
      el.style.opacity = '1';
    });
  };

  /**
   * Limpa estilos após entrada (height = auto)
   */
  const afterEnter = (el: HTMLElement) => {
    el.style.height = 'auto';
  };

  /**
   * Configura elemento antes de sair (height = scrollHeight, opacity = 1)
   */
  const beforeLeave = (el: HTMLElement) => {
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
  };

  /**
   * Anima saída do elemento (height para 0, opacity para 0)
   */
  const leave = (el: HTMLElement) => {
    el.style.transition = 'height 250ms ease-out, opacity 250ms ease-out';
    requestAnimationFrame(() => {
      el.style.height = '0';
      el.style.opacity = '0';
    });
  };

  /**
   * Limpa estilos após saída (height = auto)
   */
  const afterLeave = (el: HTMLElement) => {
    el.style.height = 'auto';
  };

  return {
    beforeEnter,
    enter,
    afterEnter,
    beforeLeave,
    leave,
    afterLeave,
  };
};
