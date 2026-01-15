import { create } from 'zustand';

interface RefreshStore {
    categoriesVersion: number;
    subcategoriesVersion: number;
    productsVersion: number;
    imagesVersion: number;
    variantsVersion: number;


    bumpCategories: () => void;
    bumpSubcategories: () => void;
    bumpProducts: () => void;
    bumpImages: () => void;
    bumpVariants: () => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
    categoriesVersion: 0,
    subcategoriesVersion: 0,
    productsVersion: 0,
    imagesVersion: 0,
    variantsVersion: 0,



    bumpCategories: () => set((s) => ({ categoriesVersion: s.categoriesVersion + 1 })),
    bumpSubcategories: () => set((s) => ({ subcategoriesVersion: s.subcategoriesVersion + 1 })),
    bumpProducts: () => set((s) => ({ productsVersion: s.productsVersion + 1 })),
    bumpImages: () => set((s) => ({ imagesVersion: s.imagesVersion + 1 })),
    bumpVariants: () => set((s) => ({ variantsVersion: s.variantsVersion + 1 }))
    
}));