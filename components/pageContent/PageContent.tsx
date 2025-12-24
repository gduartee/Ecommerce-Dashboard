"use client";

import { useSectionStore } from "@/store/useSectionStore";
import { CategoryTable } from "../table/CategoryTable";

export function PageContent() {
    const { activeSection } = useSectionStore();
    return (
        <main>
            {activeSection === "categorySection" && <CategoryTable />}
        </main>
    )
} 