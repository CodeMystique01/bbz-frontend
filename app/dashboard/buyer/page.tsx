"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, DollarSign, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BuyerDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success",
    DELIVERED: "success",
    PENDING: "warning",
    PROCESSING: "warning",
    CANCELLED: "error",
    REFUNDED: "error",
};

export default function BuyerDashboardPage() {
    const [data, setData] = useState<BuyerDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const res = await apiClient.get<BuyerDashboard>("/api/dashboard/buyer");
            setData(res);
        } catch {
            // Dashboard may fail if no orders yet
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
    }

    const stats = data || { totalOrders: 0, totalSpent: 0, completedOrders: 0, pendingOrders: 0, recentPurchases: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your purchases and activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-primary-50 text-primary-600" />
                <StatCard icon={DollarSign} label="Total Spent" value={formatPrice(stats.totalSpent)} color="bg-green-50 text-green-600" />
                <StatCard icon={CheckCircle} label="Completed" value={stats.completedOrders} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={Clock} label="Pending" value={stats.pendingOrders} color="bg-amber-50 text-amber-600" />
            </div>

            {/* Recent Purchases */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Purchases</h2>
                    <Link href="/dashboard/buyer/orders" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        View All <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                {stats.recentPurchases.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No purchases yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {stats.recentPurchases.map((order) => (
                            <Link
                                key={order.id}
                                href={`/dashboard/buyer/orders/${order.id}`}
                                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {order.items.map((i) => i.productName).join(", ")}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Badge variant={STATUS_COLORS[order.status] || "default"}>
                                        {order.status}
                                    </Badge>
                                    <span className="font-semibold text-gray-900 text-sm">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
