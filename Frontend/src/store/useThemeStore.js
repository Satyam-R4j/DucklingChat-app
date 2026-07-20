import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("duckling-theme") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("duckling-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
