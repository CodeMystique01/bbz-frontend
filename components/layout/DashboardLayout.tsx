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
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
            <Navbar />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    width: "100%",
                    maxWidth: 1200,
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: 24,
                    paddingRight: 24,
                    paddingTop: 32,
                    paddingBottom: 32,
                    gap: 32,
                }}
            >
                {sidebar}
                <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
            </div>
            <Footer />
        </div>
    );
}
