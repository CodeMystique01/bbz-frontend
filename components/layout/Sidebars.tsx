"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, ShoppingBag, Heart, MessageSquare, Key, Settings,
    Package, Plus, DollarSign, BarChart3, Users, Shield, CreditCard,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

function SidebarNav({ items, title }: { items: SidebarItem[]; title: string }) {
    const pathname = usePathname();
    return (
        <aside className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-1">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">{title}</h2>
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}>
                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary-600" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    );
                })}
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
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const vendorItems: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Products", href: "/dashboard/vendor/products", icon: Package },
    { label: "Add Product", href: "/dashboard/vendor/products/new", icon: Plus },
    { label: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
    { label: "Earnings", href: "/dashboard/vendor/earnings", icon: DollarSign },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart3 },
    { label: "Messages", href: "/dashboard/vendor/messages", icon: MessageSquare },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminItems: SidebarItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Payouts", href: "/admin/payouts", icon: CreditCard },
    { label: "Compliance", href: "/admin/compliance", icon: Shield },
];

export function BuyerSidebar() { return <SidebarNav items={buyerItems} title="Buyer Menu" />; }
export function VendorSidebar() { return <SidebarNav items={vendorItems} title="Vendor Menu" />; }
export function AdminSidebar() { return <SidebarNav items={adminItems} title="Admin Menu" />; }
