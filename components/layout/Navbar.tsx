"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
    Search,
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
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

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
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <Store className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Buy<span className="text-primary-600">Bizz</span>
                        </span>
                    </Link>

                    {/* Search Bar — Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right section — Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/products"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Products
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/cart"
                                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <Avatar name={user?.name || user?.email} size="sm" />
                                        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", userMenuOpen && "rotate-180")} />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 animate-fade-in">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.name || user?.email}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                                    {user?.role?.toLowerCase()}
                                                </p>
                                            </div>
                                            <Link
                                                href={dashboardPath}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4" />
                                                Profile
                                            </Link>
                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    Log in
                                </Link>
                                <Link href="/signup" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search products..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                        </div>
                        <div className="space-y-1">
                            <Link href="/products" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Products</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/cart" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
                                    <Link href={dashboardPath} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">Log out</button>
                                </>
                            ) : (
                                <div className="flex gap-2 pt-2">
                                    <Link href="/login" className="flex-1 text-center text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                                    <Link href="/signup" className="flex-1 text-center text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2.5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
