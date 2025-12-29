import { create } from 'zustand';

interface RefreshStore {
    categoriesVersion: number;
    subcategoriesVersion: number;
    productsVersion: number;


    bumpCategories: () => void;
    bumpSubcategories: () => void;
    bumpProducts: () => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
    categoriesVersion: 0,
    subcategoriesVersion: 0,
    productsVersion: 0,




    bumpCategories: () => set((s) => ({ categoriesVersion: s.categoriesVersion + 1 })),
    bumpSubcategories: () => set((s) => ({ subcategoriesVersion: s.subcategoriesVersion + 1 })),
    bumpProducts: () => set((s) => ({ productsVersion: s.productsVersion + 1 })),
}));