"use client";

import { type ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
    sidebar: ReactNode;
    mobileSidebar?: ReactNode;
    children: ReactNode;
}

export function DashboardLayout({ sidebar, mobileSidebar, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 40,
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                    }}
                >
                    <Menu style={{ height: 20, width: 20 }} />
                </button>

                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden"
                        style={{ position: "fixed", inset: 0, zIndex: 50 }}
                    >
                        {/* Backdrop */}
                        <div
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(4px)",
                            }}
                        />
                        {/* Sidebar panel */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 280,
                                background: "#fff",
                                boxShadow: "4px 0 24px rgba(0,0,0,0.1)",
                                padding: "16px 0",
                                overflowY: "auto",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 12px" }}>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    style={{
                                        padding: 6,
                                        borderRadius: 8,
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "#9ca3af",
                                    }}
                                >
                                    <X style={{ height: 18, width: 18 }} />
                                </button>
                            </div>
                            <div onClick={() => setSidebarOpen(false)}>
                                {mobileSidebar || sidebar}
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop sidebar */}
                {sidebar}
                <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
            </div>
            <Footer />
        </div>
    );
}
