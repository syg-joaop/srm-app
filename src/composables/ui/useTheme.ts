export function useTheme() {
  const theme = ref<"light" | "dark">("light");
  const isDark = computed(() => theme.value === "dark");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    updateDomTheme();
    saveTheme();
  };

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
    updateDomTheme();
    saveTheme();
  };

  const updateDomTheme = () => {
    if (process.client) {
      const html = document.documentElement;

      if (theme.value === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }

      html.setAttribute("data-theme", theme.value);
    }
  };

  const saveTheme = () => {
    if (process.client) {
      localStorage.setItem("theme", theme.value);
    }
  };

  const loadTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem("theme") as "light" | "dark" | null;

      if (saved && (saved === "light" || saved === "dark")) {
        theme.value = saved;
      } else {
        // Detectar preferência do sistema
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        theme.value = prefersDark ? "dark" : "light";
      }
    }
  };

  const initializeTheme = () => {
    if (process.client) {
      loadTheme();
      updateDomTheme();

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem("theme")) {
          theme.value = e.matches ? "dark" : "light";
          updateDomTheme();
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      // Cleanup
      onUnmounted(() => {
        mediaQuery.removeEventListener("change", handleChange);
      });
    }
  };

  onMounted(() => {
    initializeTheme();
  });

  return {
    theme: readonly(theme),
    isDark,
    toggleTheme,
    setTheme,
    initializeTheme,
  };
}
