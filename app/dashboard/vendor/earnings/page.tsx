"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function VendorEarningsPage() {
    const [data, setData] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        try { const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor"); setData(res); }
        catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalSales: 0, totalOrders: 0, totalProducts: 0, totalLicenses: 0, topProducts: [], recentOrders: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Earnings</h1>
                <p className="text-xs text-gray-400 mt-0.5">Revenue and sales analytics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: DollarSign, label: "Total Revenue", value: formatPrice(stats.totalSales), color: "text-green-500" },
                    { icon: ShoppingBag, label: "Total Orders", value: stats.totalOrders, color: "text-primary-500" },
                    { icon: Package, label: "Active Products", value: stats.totalProducts, color: "text-violet-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-gray-100">
                <div className="p-4 border-b border-gray-50">
                    <h2 className="text-sm font-medium text-gray-900">Revenue by Product</h2>
                </div>
                {stats.topProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <TrendingUp className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No sales data yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {stats.topProducts.map((p, i) => {
                            const maxRevenue = Math.max(...stats.topProducts.map((tp) => tp.revenue));
                            const pct = maxRevenue > 0 ? (p.revenue / maxRevenue) * 100 : 0;
                            return (
                                <div key={i} className="px-4 py-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm text-gray-900">{p.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] text-gray-400">{p.totalSold} sales</span>
                                            <span className="text-xs font-medium text-gray-900">{formatPrice(p.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 rounded-full bg-gray-50 overflow-hidden">
                                        <div className="h-full bg-primary-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
