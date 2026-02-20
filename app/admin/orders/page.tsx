"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Order } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS = ["", "PENDING", "PROCESSING", "CONFIRMED", "DELIVERED", "CANCELLED", "REFUNDED"];
const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { loadOrders(); }, [page, statusFilter]);

    async function loadOrders() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "15");
            if (statusFilter) params.set("status", statusFilter);

            const res = await apiClient.get<{ orders: Order[]; totalPages: number } | Order[]>(
                `/api/admin/orders?${params.toString()}`
            );

            if (Array.isArray(res)) {
                setOrders(res);
                setTotalPages(1);
            } else {
                setOrders(res.orders || []);
                setTotalPages(res.totalPages || 1);
            }
        } catch {
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStatusUpdate(orderId: string, newStatus: string) {
        try {
            await apiClient.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o));
            toast.success(`Order updated to ${newStatus}`);
        } catch {
            toast.error("Failed to update order status");
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-sm text-gray-500 mt-1">Oversee all platform orders</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-gray-400" />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none">
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No orders found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Order ID</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Buyer</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Total</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Date</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono text-xs text-primary-600 font-medium">#{order.id.slice(0, 8)}</td>
                                        <td className="px-5 py-4 text-gray-700">{order.buyer?.email || "—"}</td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-5 py-4">
                                            <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="px-2 py-1.5 rounded border border-gray-200 bg-white text-xs focus:outline-none"
                                            >
                                                {STATUS_OPTIONS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                            <span className="text-gray-500">Page {page} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
