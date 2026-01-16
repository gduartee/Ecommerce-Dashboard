import { create } from "zustand";

// 1. Definições de Tipo 
type Scope = "category" | "subcategory" | "product" | "customer";
type ID = string | number; // Aceita ambos sem precisar converter forçadamente

interface State {
  selected: Record<Scope, ID | null>;
}

interface Actions {
  toggle: (scope: Scope, id: ID) => void; // Renomeado para 'toggle' para refletir a ação real
  clear: (scope: Scope) => void;
  clearAll: () => void;
}

// 2. Estado Inicial Constante (Facilita o reset)
const INITIAL_SELECTION: Record<Scope, ID | null> = {
  category: null,
  subcategory: null,
  product: null,
  customer: null
};

export const useSelectionStore = create<State & Actions>((set) => ({
  // Estado inicial
  selected: { ...INITIAL_SELECTION },

  // Actions
  toggle: (scope, id) =>
    set((state) => {
      const currentId = state.selected[scope];
      // Se o ID clicado for igual ao atual, desmarca (null). Senão, marca o novo.
      const nextId = currentId === id ? null : id;

      return {
        selected: {
          ...state.selected,
          [scope]: nextId,
        },
      };
    }),

  clear: (scope) =>
    set((state) => ({
      selected: {
        ...state.selected,
        [scope]: null,
      },
    })),

  // 3. Reset limpo usando a constante
  clearAll: () => set({ selected: { ...INITIAL_SELECTION } }),
}));