import { create } from "zustand";

type Scope = "category" | "product";

type State = {
    selected: Record<Scope, string | null>;
};

type Actions = {
    select: (scope: Scope, id: number | string) => void; // toggle
    clear: (scope: Scope) => void;
    clearAll: () => void;
};

export const useSelectionStore = create<State & Actions>((set, get) => ({
    selected: {
        category: null,
        product: null,
    },
    select: (scope, id) => {
        const curr = get().selected[scope];
        const next = curr === String(id) ? null : String(id);
        set((s) => ({ selected: { ...s.selected, [scope]: next } }));
    },
    clear: (scope) =>
        set((s) => ({ selected: { ...s.selected, [scope]: null } })),
    clearAll: () =>
        set(() => ({
            selected: { service: null, category: null, subCategory: null, employee: null, product: null, promotion: null },
        })),
}));