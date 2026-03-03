"use client";

import { useEffect, useState } from "react";
import { Filter, ShoppingBag } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
];

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success", COMPLETED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error", FAILED: "error",
};

export default function VendorOrdersPage() {
    const [data, setData] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        try { const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor"); setData(res); }
        catch { /* ignore */ } finally { setIsLoading(false); }
    }

    const orders = data?.recentOrders?.filter((o) => !statusFilter || o.status === statusFilter) || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                <p className="text-xs text-gray-400 mt-0.5">Manage incoming orders</p>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-300" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 focus:outline-none">
                    {STATUS_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : orders.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <ShoppingBag className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">Orders from buyers will appear here</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Order</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Buyer</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-mono text-xs text-primary-600">#{order.id.slice(0, 8)}</td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">{order.buyerEmail}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 text-xs">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-4 py-3"><Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge></td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(order.date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
