import { create } from 'zustand';

type Section = 'home' | 'categorySection';

type MenuStore = {
    activeSection: Section;
    setActiveSection: (section: Section) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
    activeSection: 'home',
    setActiveSection: (section) => set({ activeSection: section }),
}));