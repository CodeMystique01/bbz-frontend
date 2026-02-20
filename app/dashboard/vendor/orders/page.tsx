"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Filter } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function VendorOrdersPage() {
    const [dashboard, setDashboard] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor");
            setDashboard(res);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    const orders = dashboard?.recentOrders || [];
    const filteredOrders = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">{orders.length} orders for your products</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none"
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">Orders for your products will appear here</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Order ID</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Buyer</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Items</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Total</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono text-xs text-primary-600 font-medium">#{order.id.slice(0, 8)}</td>
                                        <td className="px-5 py-4 text-gray-700">{order.buyerEmail}</td>
                                        <td className="px-5 py-4 text-gray-700 max-w-xs truncate">
                                            {order.items.map((i) => i.productName).join(", ")}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-5 py-4">
                                            <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{formatDate(order.date)}</td>
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
