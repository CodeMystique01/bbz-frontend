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
                    <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Sales performance and customer insights</p>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: TrendingUp, label: "Revenue", value: formatPrice(sales.totalRevenue), color: "text-green-500" },
                    { icon: ShoppingBag, label: "Orders", value: sales.totalOrders, color: "text-primary-500" },
                    { icon: BarChart3, label: "Avg Order Value", value: formatPrice(sales.averageOrderValue), color: "text-purple-500" },
                    { icon: Users, label: "Unique Customers", value: behavior.uniqueCustomers, color: "text-amber-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Daily Sales Chart */}
                <div className="rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 p-4 border-b border-gray-50">
                        <Calendar className="h-4 w-4 text-primary-500" />
                        <h2 className="text-sm font-medium text-gray-900">Daily Sales</h2>
                    </div>
                    {sales.dailySales.length === 0 ? (
                        <div className="p-8 flex items-center justify-center text-xs text-gray-400">No data for this period</div>
                    ) : (
                        <div className="p-4 space-y-2">
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
                <div className="rounded-xl border border-gray-100">
                    <div className="p-4 border-b border-gray-50">
                        <h2 className="text-sm font-medium text-gray-900">Customer Insights</h2>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500">Repeat Customers</span>
                            <span className="text-sm font-semibold text-gray-900">{behavior.repeatCustomers}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500">Average Rating</span>
                            <span className="text-sm font-semibold text-gray-900">{behavior.averageRating ? behavior.averageRating.toFixed(1) : "—"} ⭐</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500">Conversion Rate</span>
                            <span className="text-sm font-semibold text-gray-900">{behavior.conversionRate ? (behavior.conversionRate * 100).toFixed(1) : "0"}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
