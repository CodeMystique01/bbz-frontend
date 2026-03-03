"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, DollarSign, Key, TrendingUp, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

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
        try { const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor"); setData(res); }
        catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalProducts: 0, totalSales: 0, totalOrders: 0, totalLicenses: 0, topProducts: [], recentOrders: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">Overview of your store</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: Package, label: "Products", value: stats.totalProducts, color: "text-primary-500" },
                    { icon: DollarSign, label: "Revenue", value: formatPrice(stats.totalSales), color: "text-green-500" },
                    { icon: ShoppingBag, label: "Orders", value: stats.totalOrders, color: "text-amber-500" },
                    { icon: Key, label: "Licenses", value: stats.totalLicenses, color: "text-violet-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Top Products */}
                <div className="rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between p-4 border-b border-gray-50">
                        <h2 className="text-sm font-medium text-gray-900">Top Products</h2>
                        <Link href="/dashboard/vendor/products" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
                    </div>
                    {stats.topProducts.length === 0 ? (
                        <div className="p-8 text-center"><Package className="h-8 w-8 text-gray-200 mx-auto mb-2" /><p className="text-xs text-gray-400">No products yet</p></div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {stats.topProducts.slice(0, 5).map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-[11px] text-gray-300 w-4">{i + 1}.</span>
                                        <p className="text-sm text-gray-900 truncate">{p.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <span className="text-xs text-gray-400">{p.totalSold} sold</span>
                                        <span className="text-xs font-medium text-gray-900">{formatPrice(p.revenue)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between p-4 border-b border-gray-50">
                        <h2 className="text-sm font-medium text-gray-900">Recent Orders</h2>
                        <Link href="/dashboard/vendor/orders" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <div className="p-8 text-center"><ShoppingBag className="h-8 w-8 text-gray-200 mx-auto mb-2" /><p className="text-xs text-gray-400">No orders yet</p></div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {stats.recentOrders.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4">
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-900 truncate">{order.buyerEmail}</p>
                                        <p className="text-[11px] text-gray-300 mt-0.5">{formatDate(order.date)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-4">
                                        <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                        <span className="text-xs font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
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
