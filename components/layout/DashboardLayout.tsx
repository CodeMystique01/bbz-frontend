"use client";

import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface DashboardLayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {sidebar}
                <main className="flex-1 min-w-0">{children}</main>
            </div>
            <Footer />
        </div>
    );
}
