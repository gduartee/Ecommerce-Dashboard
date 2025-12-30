"use client";

import { useSectionStore } from "@/store/useSectionStore";
import { CategoryTable } from "../table/CategoryTable";
import { ProductTable } from "../table/ProductTable";

export function PageContent() {
    const { activeSection } = useSectionStore();
    return (
        <main>
            {activeSection === "categorySection" && <CategoryTable />}
            {activeSection === "productSection" && <ProductTable />}
        </main>
    )
} 