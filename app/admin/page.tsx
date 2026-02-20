"use client";

import { useEffect, useState } from "react";
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown, Award } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AdminDashboard } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, color, growth }: {
    icon: React.ElementType; label: string; value: string | number; color: string; growth?: number;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                {growth !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(growth).toFixed(1)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<AdminDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const res = await apiClient.get<AdminDashboard>("/api/dashboard/admin");
            setData(res);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const stats = data || { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, userGrowthRate: 0, orderGrowthRate: 0, revenueGrowthRate: 0, topVendors: [], revenueTrend: [], userTrend: [] };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Platform overview and key metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-primary-50 text-primary-600" growth={stats.userGrowthRate} />
                <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-purple-50 text-purple-600" />
                <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-amber-50 text-amber-600" growth={stats.orderGrowthRate} />
                <StatCard icon={DollarSign} label="Total Revenue" value={formatPrice(stats.totalRevenue)} color="bg-green-50 text-green-600" growth={stats.revenueGrowthRate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Revenue Trend</h2>
                    {stats.revenueTrend.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
                    ) : (
                        <div className="space-y-2">
                            {stats.revenueTrend.slice(-7).map((item) => {
                                const max = Math.max(...stats.revenueTrend.map((r) => r.revenue), 1);
                                return (
                                    <div key={item.date} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-20 shrink-0">
                                            {new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                        </span>
                                        <div className="flex-1 h-6 bg-gray-50 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded"
                                                style={{ width: `${(item.revenue / max) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 w-20 text-right">{formatPrice(item.revenue)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Top Vendors */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                        <Award className="h-4 w-4 text-amber-500" />
                        <h2 className="font-semibold text-gray-900">Top Vendors</h2>
                    </div>
                    {stats.topVendors.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400">No vendor data yet</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stats.topVendors.slice(0, 5).map((vendor, i) => (
                                <div key={vendor.id} className="flex items-center gap-4 p-4">
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" :
                                            i === 1 ? "bg-gray-200 text-gray-600" :
                                                i === 2 ? "bg-orange-100 text-orange-700" :
                                                    "bg-gray-100 text-gray-500"
                                        }`}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{vendor.email}</p>
                                        <p className="text-xs text-gray-400">{vendor.totalProducts} products · {vendor.totalOrders} orders</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(vendor.totalRevenue)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
