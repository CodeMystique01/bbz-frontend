"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, ShoppingBag, Package } from "lucide-react";
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
        <div>
            {/* Page header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>My Orders</h1>
                <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4, marginBottom: 0 }}>Track and manage your purchase history</p>
            </div>

            {/* Filter bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Filter style={{ height: 14, width: 14, color: "#9ca3af" }} />
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    style={{
                        padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb",
                        background: "#fff", fontSize: 13, color: "#374151", cursor: "pointer", outline: "none"
                    }}
                >
                    {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                    <Spinner size="lg" />
                </div>
            ) : orders.length === 0 ? (
                <div style={{
                    background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16,
                    padding: "64px 32px", textAlign: "center"
                }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: "50%", background: "#f9fafb",
                        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
                    }}>
                        <ShoppingBag style={{ height: 24, width: 24, color: "#d1d5db" }} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>No orders found</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Try adjusting your filters</p>
                </div>
            ) : (
                <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
                    {/* Table header */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "120px 1fr 110px 120px 110px",
                        padding: "12px 20px", borderBottom: "1px solid #f5f5f5",
                        background: "#fafafa"
                    }}>
                        {["Order ID", "Items", "Total", "Status", "Date"].map(col => (
                            <span key={col} style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {col}
                            </span>
                        ))}
                    </div>

                    {/* Table rows */}
                    {orders.map((order, i) => (
                        <Link
                            key={order.id}
                            href={`/dashboard/buyer/orders/${order.id}`}
                            style={{
                                display: "grid", gridTemplateColumns: "120px 1fr 110px 120px 110px",
                                padding: "16px 20px", textDecoration: "none", alignItems: "center",
                                borderBottom: i < orders.length - 1 ? "1px solid #f5f5f5" : "none",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#2563eb", fontWeight: 500 }}>
                                #{order.id.slice(0, 8)}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                <Package style={{ height: 14, width: 14, color: "#d1d5db", flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {order.items?.map((i) => i.product?.name).filter(Boolean).join(", ") || `${order.items?.length || 0} item(s)`}
                                </span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{formatPrice(order.totalAmount)}</span>
                            <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(order.createdAt)}</span>
                        </Link>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 20px", borderTop: "1px solid #f5f5f5"
                        }}>
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>Page {page} of {totalPages}</span>
                            <div style={{ display: "flex", gap: 6 }}>
                                {[
                                    { icon: ChevronLeft, disabled: page === 1, action: () => setPage(p => Math.max(1, p - 1)) },
                                    { icon: ChevronRight, disabled: page === totalPages, action: () => setPage(p => Math.min(totalPages, p + 1)) }
                                ].map(({ icon: Icon, disabled, action }, idx) => (
                                    <button key={idx} onClick={action} disabled={disabled} style={{
                                        width: 30, height: 30, borderRadius: 6, border: "1px solid #e5e7eb",
                                        background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1
                                    }}>
                                        <Icon style={{ height: 14, width: 14, color: "#6b7280" }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
