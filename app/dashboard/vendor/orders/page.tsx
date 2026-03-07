"use client";

import { useEffect, useState } from "react";
import { Filter, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderListResponse } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

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
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => { loadOrders(); }, [page, statusFilter]);

    async function loadOrders() {
        if (!user) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            params.set("page", String(page));
            params.set("limit", String(limit));
            const res = await apiClient.get<OrderListResponse>(`/api/orders/vendor/${user.id}?${params.toString()}`);
            setOrders(res.orders ?? []);
            setTotalPages(res.totalPages ?? 1);
        } catch { setOrders([]); } finally { setIsLoading(false); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                <p className="text-xs text-gray-400 mt-0.5">Manage incoming orders</p>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-300" />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-mono text-xs text-primary-600">#{order.id.slice(0, 8)}</td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">{order.buyer?.email || "—"}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                                            {order.items?.map((i) => i.product?.name).filter(Boolean).join(", ") || `${order.items?.length || 0} items`}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 text-xs">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-4 py-3"><Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge></td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-xs">
                            <span className="text-gray-400">Page {page} of {totalPages}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
