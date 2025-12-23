import { create } from 'zustand';

interface RefreshStore {
    categoriasVersion: number;



    bumpCategorias: () => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
    categoriasVersion: 0,



    bumpCategorias: () => set((s) => ({ categoriasVersion: s.categoriasVersion + 1 })),
}));