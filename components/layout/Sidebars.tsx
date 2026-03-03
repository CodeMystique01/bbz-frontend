"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, ShoppingBag, Heart, MessageSquare, Key,
    Package, Plus, DollarSign, BarChart3, Users, Shield, CreditCard,
    User, Wallet,
    type LucideIcon,
} from "lucide-react";

interface SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

function SidebarNav({ items, title }: { items: SidebarItem[]; title: string }) {
    const pathname = usePathname();
    return (
        <aside style={{ width: 220, flexShrink: 0 }} className="hidden lg:block">
            <div style={{ position: "sticky", top: 80 }}>
                <h2
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#d1d5db",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "0 12px",
                        marginBottom: 16,
                    }}
                >
                    {title}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: isActive ? 500 : 400,
                                    color: isActive ? "#1d4ed8" : "#6b7280",
                                    background: isActive ? "#eff6ff" : "transparent",
                                    textDecoration: "none",
                                    transition: "background .15s, color .15s",
                                }}
                            >
                                <item.icon
                                    style={{
                                        height: 16,
                                        width: 16,
                                        color: isActive ? "#3b82f6" : "#d1d5db",
                                    }}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

const buyerItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/buyer/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/buyer/wishlist", icon: Heart },
    { label: "Messages", href: "/dashboard/buyer/messages", icon: MessageSquare },
    { label: "Licenses", href: "/dashboard/buyer/licenses", icon: Key },
    { label: "Profile", href: "/dashboard/buyer/profile", icon: User },
];

const vendorItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Products", href: "/dashboard/vendor/products", icon: Package },
    { label: "Add Product", href: "/dashboard/vendor/products/new", icon: Plus },
    { label: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
    { label: "Earnings", href: "/dashboard/vendor/earnings", icon: DollarSign },
    { label: "Payouts", href: "/dashboard/vendor/payouts", icon: Wallet },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart3 },
    { label: "Messages", href: "/dashboard/vendor/messages", icon: MessageSquare },
    { label: "Profile", href: "/dashboard/vendor/profile", icon: User },
];

const adminItems: SidebarItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
    { label: "Compliance", href: "/admin/compliance", icon: Shield },
];

export function BuyerSidebar() { return <SidebarNav items={buyerItems} title="Buyer" />; }
export function VendorSidebar() { return <SidebarNav items={vendorItems} title="Vendor" />; }
export function AdminSidebar() { return <SidebarNav items={adminItems} title="Admin" />; }
