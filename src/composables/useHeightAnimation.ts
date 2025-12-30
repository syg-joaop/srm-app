/**
 * Composable para animações de altura (expand/collapse).
 * Reutilizável em qualquer componente que precisa de animações suaves de altura.
 */

export const useHeightAnimation = () => {
  /**
   * Configura elemento antes de entrar (height = 0, opacity = 0)
   */
  const beforeEnter = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.height = '0';
    htmlEl.style.opacity = '0';
  };

  /**
   * Anima entrada do elemento (height para scrollHeight, opacity para 1)
   */
  const enter = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.transition = 'height 250ms ease-out, opacity 250ms ease-out';
    requestAnimationFrame(() => {
      htmlEl.style.height = htmlEl.scrollHeight + 'px';
      htmlEl.style.opacity = '1';
    });
  };

  /**
   * Limpa estilos após entrada (height = auto)
   */
  const afterEnter = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.height = 'auto';
  };

  /**
   * Configura elemento antes de sair (height = scrollHeight, opacity = 1)
   */
  const beforeLeave = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.height = htmlEl.scrollHeight + 'px';
    htmlEl.style.opacity = '1';
  };

  /**
   * Anima saída do elemento (height para 0, opacity = 0)
   */
  const leave = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.transition = 'height 250ms ease-out, opacity 250ms ease-out';
    requestAnimationFrame(() => {
      htmlEl.style.height = '0';
      htmlEl.style.opacity = '0';
    });
  };

  /**
   * Limpa estilos após saída (height = auto)
   */
  const afterLeave = (el: Element) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.height = 'auto';
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
