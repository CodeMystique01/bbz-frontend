"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, DollarSign, ShoppingBag, Key, ArrowRight, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, color, subLabel }: { icon: React.ElementType; label: string; value: string | number; color: string; subLabel?: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subLabel && <p className="text-xs text-gray-400 mt-1">{subLabel}</p>}
        </div>
    );
}

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function VendorDashboardPage() {
    const [data, setData] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor");
            setData(res);
        } catch { /* may fail if no data yet */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalProducts: 0, totalSales: 0, totalOrders: 0, totalLicenses: 0, assignedLicenses: 0, recentOrders: [], topProducts: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Package} label="Products" value={stats.totalProducts} color="bg-primary-50 text-primary-600" />
                <StatCard icon={DollarSign} label="Total Sales" value={formatPrice(stats.totalSales)} color="bg-green-50 text-green-600" />
                <StatCard icon={ShoppingBag} label="Orders" value={stats.totalOrders} color="bg-purple-50 text-purple-600" />
                <StatCard icon={Key} label="Licenses" value={`${stats.assignedLicenses}/${stats.totalLicenses}`} color="bg-amber-50 text-amber-600" subLabel="Assigned / Total" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary-500" />
                            <h2 className="font-semibold text-gray-900">Top Products</h2>
                        </div>
                        <Link href="/dashboard/vendor/products" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            View All <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    {stats.topProducts.length === 0 ? (
                        <div className="p-8 text-center">
                            <Package className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No product data yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stats.topProducts.map((p, i) => (
                                <div key={p.id} className="flex items-center gap-4 p-4">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.totalSold} sold</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(p.revenue)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                        <Link href="/dashboard/vendor/orders" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            View All <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <div className="p-8 text-center">
                            <ShoppingBag className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No orders yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stats.recentOrders.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {order.items.map((i) => i.productName).join(", ")}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{order.buyerEmail} · {formatDate(order.date)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                        <span className="text-sm font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
