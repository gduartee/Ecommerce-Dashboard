import { create } from 'zustand';

interface RefreshStore {
    categoriesVersion: number;
    productsVersion: number;


    bumpCategories: () => void;
    bumpProducts: () => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
    categoriesVersion: 0,
    productsVersion: 0,




    bumpCategories: () => set((s) => ({ categoriesVersion: s.categoriesVersion + 1 })),
    bumpProducts: () => set((s) => ({ productsVersion: s.productsVersion + 1 })),
}));