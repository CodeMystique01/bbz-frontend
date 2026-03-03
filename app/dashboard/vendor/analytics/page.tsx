"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingBag, Calendar } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

interface SalesData {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    dailySales: { date: string; revenue: number; orders: number }[];
}

interface BehaviorData {
    uniqueCustomers: number;
    repeatCustomers: number;
    averageRating: number;
    conversionRate: number;
}

interface AnalyticsResponse {
    success: boolean;
    data: {
        sales: SalesData;
        behavior: BehaviorData;
        period: { startDate: string; endDate: string };
    };
}

const PERIODS = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" },
];

export default function VendorAnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState("30d");

    useEffect(() => { loadAnalytics(); }, [period]);

    async function loadAnalytics() {
        setIsLoading(true);
        try {
            const res = await apiClient.get<AnalyticsResponse>(`/api/analytics/vendor?period=${period}`);
            setAnalytics(res.data);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const sales = analytics?.sales || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, dailySales: [] };
    const behavior = analytics?.behavior || { uniqueCustomers: 0, repeatCustomers: 0, averageRating: 0, conversionRate: 0 };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Sales performance and customer insights</p>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    {PERIODS.map((p) => (
                        <button key={p.value} onClick={() => setPeriod(p.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${period === p.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}>{p.label}</button>
                    ))}
                </div>
            </div>

            {/* Sales Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-green-500" /><span className="text-sm text-gray-500">Revenue</span></div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(sales.totalRevenue)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2"><ShoppingBag className="h-4 w-4 text-primary-500" /><span className="text-sm text-gray-500">Orders</span></div>
                    <p className="text-2xl font-bold text-gray-900">{sales.totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2"><BarChart3 className="h-4 w-4 text-purple-500" /><span className="text-sm text-gray-500">Avg Order Value</span></div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(sales.averageOrderValue)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-amber-500" /><span className="text-sm text-gray-500">Unique Customers</span></div>
                    <p className="text-2xl font-bold text-gray-900">{behavior.uniqueCustomers}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Sales Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4"><Calendar className="h-4 w-4 text-primary-500" /><h2 className="font-semibold text-gray-900">Daily Sales</h2></div>
                    {sales.dailySales.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data for this period</div>
                    ) : (
                        <div className="space-y-2">
                            {sales.dailySales.slice(-10).map((day) => {
                                const max = Math.max(...sales.dailySales.map((d) => d.revenue), 1);
                                return (
                                    <div key={day.date} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-16 shrink-0">
                                            {new Date(day.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                        </span>
                                        <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded" style={{ width: `${(day.revenue / max) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 w-20 text-right">{formatPrice(day.revenue)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Behavior Metrics */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Customer Insights</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Repeat Customers</span>
                            <span className="text-lg font-bold text-gray-900">{behavior.repeatCustomers}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Average Rating</span>
                            <span className="text-lg font-bold text-gray-900">{behavior.averageRating ? behavior.averageRating.toFixed(1) : "—"} ⭐</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Conversion Rate</span>
                            <span className="text-lg font-bold text-gray-900">{behavior.conversionRate ? (behavior.conversionRate * 100).toFixed(1) : "0"}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
