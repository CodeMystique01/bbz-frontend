"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
    ShoppingCart,
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    ChevronDown,
    Store,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { Avatar } from "@/components/ui";

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { itemCount, fetchCart } = useCartStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const cartFetched = useRef(false);

    useEffect(() => {
        if (isAuthenticated && !cartFetched.current) {
            cartFetched.current = true;
            fetchCart();
        }
        if (!isAuthenticated) cartFetched.current = false;
    }, [isAuthenticated, fetchCart]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const dashboardPath =
        user?.role === "ADMIN"
            ? "/admin"
            : user?.role === "VENDOR"
                ? "/dashboard/vendor"
                : "/dashboard/buyer";

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid #f3f4f6",
            }}
        >
            <nav style={{ maxWidth: 1100, marginLeft: "auto", marginRight: "auto", paddingLeft: 24, paddingRight: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
                        <div
                            style={{
                                height: 28,
                                width: 28,
                                borderRadius: 8,
                                background: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Store style={{ height: 16, width: 16, color: "#fff" }} />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                            Buy<span style={{ color: "#2563eb" }}>Bizz</span>
                        </span>
                    </Link>

                    {/* Right section — Desktop */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
                        <Link
                            href="/products"
                            style={{
                                fontSize: 14,
                                color: "#6b7280",
                                padding: "8px 12px",
                                borderRadius: 8,
                                textDecoration: "none",
                                transition: "background .15s",
                            }}
                        >
                            Products
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/cart"
                                    style={{
                                        position: "relative",
                                        padding: 8,
                                        color: "#9ca3af",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                        display: "flex",
                                    }}
                                >
                                    <ShoppingCart style={{ height: 18, width: 18 }} />
                                    {itemCount > 0 && (
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: 2,
                                                right: 2,
                                                minWidth: 16,
                                                height: 16,
                                                borderRadius: 9999,
                                                background: "#2563eb",
                                                color: "#fff",
                                                fontSize: 10,
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "0 4px",
                                                lineHeight: 1,
                                            }}
                                        >
                                            {itemCount > 99 ? "99+" : itemCount}
                                        </span>
                                    )}
                                </Link>

                                <div style={{ position: "relative", marginLeft: 4 }} ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            padding: 6,
                                            borderRadius: 8,
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Avatar name={user?.name || user?.email} size="sm" />
                                        <ChevronDown
                                            style={{
                                                height: 14,
                                                width: 14,
                                                color: "#9ca3af",
                                                transition: "transform .15s",
                                                transform: userMenuOpen ? "rotate(180deg)" : "none",
                                            }}
                                        />
                                    </button>

                                    {userMenuOpen && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                marginTop: 8,
                                                width: 208,
                                                background: "#ffffff",
                                                borderRadius: 12,
                                                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                                                border: "1px solid #f3f4f6",
                                                padding: "4px 0",
                                            }}
                                        >
                                            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f9fafb" }}>
                                                <p style={{ fontSize: 14, fontWeight: 500, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {user?.name || user?.email}
                                                </p>
                                                <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0", textTransform: "capitalize" }}>
                                                    {user?.role?.toLowerCase()}
                                                </p>
                                            </div>
                                            <Link
                                                href={dashboardPath}
                                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 14, color: "#4b5563", textDecoration: "none" }}
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <LayoutDashboard style={{ height: 16, width: 16, color: "#9ca3af" }} />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", fontSize: 14, color: "#4b5563", textDecoration: "none" }}
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <User style={{ height: 16, width: 16, color: "#9ca3af" }} />
                                                Profile
                                            </Link>
                                            <div style={{ borderTop: "1px solid #f9fafb", marginTop: 4, paddingTop: 4 }}>
                                                <button
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 12,
                                                        padding: "10px 16px",
                                                        fontSize: 14,
                                                        color: "#ef4444",
                                                        width: "100%",
                                                        cursor: "pointer",
                                                        border: "none",
                                                        background: "transparent",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <LogOut style={{ height: 16, width: 16 }} />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                                <Link href="/login" style={{ fontSize: 14, color: "#6b7280", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        background: "#2563eb",
                                        padding: "6px 16px",
                                        borderRadius: 8,
                                        textDecoration: "none",
                                    }}
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden"
                        style={{ padding: 8, color: "#9ca3af", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}
                    >
                        {mobileMenuOpen ? <X style={{ height: 20, width: 20 }} /> : <Menu style={{ height: 20, width: 20 }} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden" style={{ padding: "12px 0", borderTop: "1px solid #f9fafb" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <Link href="/products" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#4b5563", borderRadius: 8, textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>Products</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/cart" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", fontSize: 14, color: "#4b5563", borderRadius: 8, textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>
                                        Cart
                                        {itemCount > 0 && (
                                            <span style={{ minWidth: 18, height: 18, borderRadius: 9999, background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                                                {itemCount > 99 ? "99+" : itemCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href={dashboardPath} style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#4b5563", borderRadius: 8, textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", fontSize: 14, color: "#ef4444", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>Log out</button>
                                </>
                            ) : (
                                <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
                                    <Link href="/login" style={{ flex: 1, textAlign: "center", fontSize: 14, color: "#4b5563", border: "1px solid #e5e7eb", padding: "8px 16px", borderRadius: 8, textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                                    <Link href="/signup" style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, color: "#ffffff", background: "#2563eb", padding: "8px 16px", borderRadius: 8, textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
