"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, DollarSign, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BuyerDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function BuyerDashboardPage() {
    const [data, setData] = useState<BuyerDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const res = await apiClient.get<BuyerDashboard>("/api/dashboard/buyer");
            setData(res);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalOrders: 0, totalSpent: 0, completedOrders: 0, pendingOrders: 0, recentPurchases: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">Overview of your purchases</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: ShoppingBag, label: "Total Orders", value: stats.totalOrders, color: "text-primary-500" },
                    { icon: DollarSign, label: "Total Spent", value: formatPrice(stats.totalSpent), color: "text-green-500" },
                    { icon: CheckCircle, label: "Completed", value: stats.completedOrders, color: "text-emerald-500" },
                    { icon: Clock, label: "Pending", value: stats.pendingOrders, color: "text-amber-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-gray-100">
                <div className="flex items-center justify-between p-4 border-b border-gray-50">
                    <h2 className="text-sm font-medium text-gray-900">Recent Purchases</h2>
                    <Link href="/dashboard/buyer/orders" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        View All <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
                {stats.recentPurchases.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingBag className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No purchases yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {stats.recentPurchases.map((order) => (
                            <Link key={order.id} href={`/dashboard/buyer/orders/${order.id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{order.items.map((i) => i.productName).join(", ")}</p>
                                    <p className="text-[11px] text-gray-300 mt-0.5">{formatDate(order.date)}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                    <span className="text-sm font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
