import { createJSONStorage } from "zustand/middleware";

/** localStorage que nunca lanza (modo privado, almacenamiento bloqueado…). */
export const safeLocalStorage = createJSONStorage(() => ({
  getItem: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* ignorar */
    }
  },
  removeItem: (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignorar */
    }
  },
}));
