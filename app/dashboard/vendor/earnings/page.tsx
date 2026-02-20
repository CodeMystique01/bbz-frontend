"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Package, BarChart3 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function VendorEarningsPage() {
    const [data, setData] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        try {
            const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor");
            setData(res);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalSales: 0, totalOrders: 0, totalProducts: 0, topProducts: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                <p className="text-sm text-gray-500 mt-1">Track your revenue and product performance</p>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 opacity-80" />
                        <span className="text-sm opacity-80">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-bold">{formatPrice(stats.totalSales)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary-500" />
                        <span className="text-sm text-gray-500">Total Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        <span className="text-sm text-gray-500">Active Products</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
            </div>

            {/* Product Revenue Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                    <BarChart3 className="h-4 w-4 text-primary-500" />
                    <h2 className="font-semibold text-gray-900">Revenue by Product</h2>
                </div>
                {stats.topProducts.length === 0 ? (
                    <div className="p-8 text-center">
                        <BarChart3 className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No sales data yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {stats.topProducts.map((product) => {
                            const maxRevenue = Math.max(...stats.topProducts.map((p) => p.revenue), 1);
                            const percentage = (product.revenue / maxRevenue) * 100;
                            return (
                                <div key={product.id} className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-400">{product.totalSold} units sold</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatPrice(product.revenue)}</p>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
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
