"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderListResponse } from "@/lib/types";
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
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function BuyerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => { loadOrders(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, status]);

    async function loadOrders() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (status) params.set("status", status);
            params.set("page", String(page));
            params.set("limit", String(limit));
            const res = await apiClient.get<OrderListResponse | Order[]>(`/api/orders?${params.toString()}`);
            if (Array.isArray(res)) { setOrders(res); setTotalPages(1); }
            else { setOrders(res.orders); setTotalPages(res.totalPages); }
        } catch { setOrders([]); } finally { setIsLoading(false); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
                <p className="text-xs text-gray-400 mt-0.5">Track and manage your orders</p>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-300" />
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 focus:outline-none">
                    {STATUS_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : orders.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <Search className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Order</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3">
                                            <Link href={`/dashboard/buyer/orders/${order.id}`} className="text-primary-600 hover:text-primary-700 font-mono text-xs">#{order.id.slice(0, 8)}</Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate text-xs">
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
