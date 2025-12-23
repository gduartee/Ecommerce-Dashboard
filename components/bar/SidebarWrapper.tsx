"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarWrapper() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/resetPassword")
        return null;

    return <Sidebar />
}