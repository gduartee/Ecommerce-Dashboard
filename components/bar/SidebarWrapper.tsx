"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";

export function SidebarWrapper() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return null;

    if (pathname === "/login" || pathname === "/resetPassword")
        return null;

    return <Sidebar />
}