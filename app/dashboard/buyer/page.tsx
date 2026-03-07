"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, DollarSign, CheckCircle, Clock, ArrowRight, Store } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BuyerDashboard } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success", DELIVERED: "success",
    PENDING: "warning", PROCESSING: "warning",
    CANCELLED: "error", REFUNDED: "error",
};

export default function BuyerDashboardPage() {
    const router = useRouter();
    const { user, login } = useAuthStore();
    const [data, setData] = useState<BuyerDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [becomingVendor, setBecomingVendor] = useState(false);

    async function handleBecomeVendor() {
        setBecomingVendor(true);
        try {
            const res = await apiClient.post<{
                access_token: string;
                user: { id: string; email: string; name: string; role: "BUYER" | "VENDOR" | "ADMIN"; isVendor: boolean };
            }>("/api/users/become-vendor");
            login(res.access_token, res.user);
            toast.success("Vendor access activated!");
            router.push("/dashboard/vendor");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to activate vendor access");
        } finally {
            setBecomingVendor(false);
        }
    }

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const res = await apiClient.get<BuyerDashboard>("/api/dashboard/buyer");
            setData(res);
        } catch { toast.error("Failed to load dashboard"); } finally { setIsLoading(false); }
    }

    if (isLoading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spinner size="lg" />
        </div>
    );

    const stats = data || { totalOrders: 0, totalSpent: 0, completedOrders: 0, pendingOrders: 0, recentPurchases: [] };

    const cards = [
        { icon: ShoppingBag, label: "Total Orders", value: stats.totalOrders, iconBg: "#eff6ff", iconColor: "#2563eb" },
        { icon: DollarSign, label: "Total Spent", value: formatPrice(stats.totalSpent), iconBg: "#f0fdf4", iconColor: "#16a34a" },
        { icon: CheckCircle, label: "Completed", value: stats.completedOrders, iconBg: "#ecfdf5", iconColor: "#10b981" },
        { icon: Clock, label: "Pending", value: stats.pendingOrders, iconBg: "#fffbeb", iconColor: "#d97706" },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
                    Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                </h1>
                <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4, marginBottom: 0 }}>Here&apos;s an overview of your account</p>
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

            {/* Start Selling CTA */}
            {user?.isVendor === false && (
                <div
                    style={{
                        background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                        border: "1px solid #dbeafe",
                        borderRadius: 16,
                        padding: "28px 32px",
                        marginBottom: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                background: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <Store style={{ height: 24, width: 24, color: "#fff" }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
                                Start Selling on BuyBizz
                            </h3>
                            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
                                Activate your vendor account to list products and start earning.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleBecomeVendor}
                        disabled={becomingVendor}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 24px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            background: "#2563eb",
                            border: "none",
                            borderRadius: 10,
                            cursor: becomingVendor ? "not-allowed" : "pointer",
                            opacity: becomingVendor ? 0.7 : 1,
                            whiteSpace: "nowrap",
                            transition: "opacity .15s",
                            flexShrink: 0,
                        }}
                    >
                        <Store style={{ height: 16, width: 16 }} />
                        {becomingVendor ? "Activating..." : "Start Selling"}
                    </button>
                </div>
            )}

            {/* Recent purchases */}
            <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #f5f5f5" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Recent Purchases</h2>
                    <Link href="/dashboard/buyer/orders" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                        View all <ArrowRight style={{ height: 13, width: 13 }} />
                    </Link>
                </div>

                {stats.recentPurchases.length === 0 ? (
                    <div style={{ padding: "56px 32px", textAlign: "center" }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: "50%", background: "#f9fafb",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px"
                        }}>
                            <ShoppingBag style={{ height: 22, width: 22, color: "#d1d5db" }} />
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>No purchases yet</p>
                        <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Start exploring products to make your first order</p>
                    </div>
                ) : (
                    stats.recentPurchases.map((order, i) => (
                        <Link key={order.id} href={`/dashboard/buyer/orders/${order.id}`}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "16px 24px", textDecoration: "none",
                                borderBottom: i < stats.recentPurchases.length - 1 ? "1px solid #f5f5f5" : "none",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 500, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {order.items.map((i) => i.productName).join(", ")}
                                </p>
                                <p style={{ fontSize: 12, color: "#9ca3af", margin: "3px 0 0" }}>{formatDate(order.date)}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 16 }}>
                                <Badge variant={STATUS_COLORS[order.status] || "default"}>{order.status}</Badge>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
