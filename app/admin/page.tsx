"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AdminDashboard } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
    const [data, setData] = useState<AdminDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try { const res = await apiClient.get<AdminDashboard>("/api/dashboard/admin"); setData(res); }
        catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const totalUsers = data?.totalUsers ?? 0;
    const totalProducts = data?.totalProducts ?? 0;
    const totalOrders = data?.totalOrders ?? 0;
    const totalRevenue = data?.totalRevenue ?? 0;
    const userGrowth = data?.userGrowthRate ?? 0;
    const orderGrowth = data?.orderGrowthRate ?? 0;
    const revenueGrowth = data?.revenueGrowthRate ?? 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">Platform overview and metrics</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: Users, label: "Users", value: totalUsers, growth: userGrowth, color: "text-primary-500" },
                    { icon: Package, label: "Products", value: totalProducts, growth: 0, color: "text-violet-500" },
                    { icon: ShoppingBag, label: "Orders", value: totalOrders, growth: orderGrowth, color: "text-amber-500" },
                    { icon: DollarSign, label: "Revenue", value: formatPrice(totalRevenue), growth: revenueGrowth, color: "text-green-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                            {s.growth !== 0 && (
                                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${s.growth > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {s.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {Math.abs(s.growth)}%
                                </div>
                            )}
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { label: "Manage Users", href: "/admin/users" },
                        { label: "Review Products", href: "/admin/products" },
                        { label: "View Orders", href: "/admin/orders" },
                        { label: "Payouts", href: "/admin/payouts" },
                    ].map((action) => (
                        <Link key={action.label} href={action.href}
                            className="p-3 rounded-lg border border-gray-100 text-center text-xs font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900 transition-colors">
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
