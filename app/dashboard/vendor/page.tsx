"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, DollarSign, Key, ArrowRight, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { VendorDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function VendorDashboardPage() {
    const { user } = useAuthStore();
    const [data, setData] = useState<VendorDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try { const res = await apiClient.get<VendorDashboard>("/api/dashboard/vendor"); setData(res); }
        catch { toast.error("Failed to load dashboard"); } finally { setIsLoading(false); }
    }

    if (isLoading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spinner size="lg" />
        </div>
    );

    const stats = data || { totalProducts: 0, totalSales: 0, totalOrders: 0, totalLicenses: 0, topProducts: [], recentOrders: [] };

    const cards = [
        { icon: Package, label: "Products", value: stats.totalProducts, iconBg: "#eff6ff", iconColor: "#2563eb" },
        { icon: DollarSign, label: "Revenue", value: formatPrice(stats.totalSales), iconBg: "#f0fdf4", iconColor: "#16a34a" },
        { icon: ShoppingBag, label: "Orders", value: stats.totalOrders, iconBg: "#fffbeb", iconColor: "#d97706" },
        { icon: Key, label: "Licenses", value: stats.totalLicenses, iconBg: "#f5f3ff", iconColor: "#7c3aed" },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
                    Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                </h1>
                <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4, marginBottom: 0 }}>Here&apos;s an overview of your store</p>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
                {cards.map((card) => (
                    <div key={card.label} style={{
                        background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14,
                        padding: "20px 24px", display: "flex", alignItems: "center", gap: 16
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12, background: card.iconBg,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>
                            <card.icon style={{ height: 20, width: 20, color: card.iconColor }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>{card.value}</p>
                            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2, marginBottom: 0 }}>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two panels: Top Products + Recent Orders */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Top Products */}
                <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <TrendingUp style={{ height: 15, width: 15, color: "#9ca3af" }} />
                            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>Top Products</h2>
                        </div>
                        <Link href="/dashboard/vendor/products" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 3, fontWeight: 500 }}>
                            View all <ArrowRight style={{ height: 12, width: 12 }} />
                        </Link>
                    </div>
                    {(stats.topProducts?.length ?? 0) === 0 ? (
                        <div style={{ padding: "48px 24px", textAlign: "center" }}>
                            <Package style={{ height: 28, width: 28, color: "#e5e7eb", margin: "0 auto 10px" }} />
                            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>No products yet</p>
                        </div>
                    ) : (
                        stats.topProducts.slice(0, 5).map((p, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 24px", borderBottom: i < 4 ? "1px solid #f5f5f5" : "none"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                    <span style={{ fontSize: 11, color: "#d1d5db", width: 16, flexShrink: 0 }}>{i + 1}.</span>
                                    <p style={{ fontSize: 13, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 12 }}>
                                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{p.totalSold} sold</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{formatPrice(p.revenue)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Orders */}
                <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <ShoppingBag style={{ height: 15, width: 15, color: "#9ca3af" }} />
                            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>Recent Orders</h2>
                        </div>
                        <Link href="/dashboard/vendor/orders" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 3, fontWeight: 500 }}>
                            View all <ArrowRight style={{ height: 12, width: 12 }} />
                        </Link>
                    </div>
                    {(stats.recentOrders?.length ?? 0) === 0 ? (
                        <div style={{ padding: "48px 24px", textAlign: "center" }}>
                            <ShoppingBag style={{ height: 28, width: 28, color: "#e5e7eb", margin: "0 auto 10px" }} />
                            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>No orders yet</p>
                        </div>
                    ) : (
                        stats.recentOrders.slice(0, 5).map((order, i) => (
                            <div key={order.id} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "14px 24px", borderBottom: i < 4 ? "1px solid #f5f5f5" : "none"
                            }}>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: 13, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.buyerEmail}</p>
                                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0" }}>{formatDate(order.date)}</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 12 }}>
                                    <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
