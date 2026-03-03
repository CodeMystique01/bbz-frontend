"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, CreditCard, Clock, CheckCircle, FileText } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Order } from "@/lib/types";
import { Spinner, Badge, Button } from "@/components/ui";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    CONFIRMED: "success",
    DELIVERED: "success",
    PENDING: "warning",
    PROCESSING: "warning",
    CANCELLED: "error",
    REFUNDED: "error",
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;
        loadOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    async function loadOrder() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<Order>(`/api/orders/${orderId}`);
            setOrder(data);
        } catch {
            setOrder(null);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
    }

    if (!order) {
        return (
            <div className="text-center py-24">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h2>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Orders
            </button>

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-sm text-gray-500 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
                </div>
                <Badge variant={STATUS_COLORS[order.status] || "default"} className="text-sm px-3 py-1">
                    {order.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-5">
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        <img
                                            src={item.product?.imageUrl || "/placeholder-product.png"}
                                            alt={item.product?.name || "Product"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{item.product?.name || "Product"}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-4">
                    {/* Payment Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <h3 className="font-semibold text-gray-900 text-sm">Payment</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="text-gray-900">{order.payment?.method || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="text-gray-900">{order.payment?.status || "Pending"}</span>
                            </div>
                            {order.payment?.transactionId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Transaction ID</span>
                                    <span className="font-mono text-xs text-gray-900">{order.payment.transactionId.slice(0, 12)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 text-sm mb-3">Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Items</span>
                                <span className="text-gray-900">{order.items?.length || 0}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between text-base">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Invoice */}
                    <button
                        onClick={async () => {
                            try {
                                const invoice = await apiClient.get<{ id: string; invoiceNumber: string }>(`/api/invoices/order/${order.id}`);
                                toast.success(`Invoice ${invoice.invoiceNumber || invoice.id.slice(0, 8)} loaded`);
                            } catch { toast.error("Invoice not available yet"); }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 text-sm font-medium transition-colors cursor-pointer"
                    >
                        <FileText className="h-4 w-4" /> Download Invoice
                    </button>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <h3 className="font-semibold text-gray-900 text-sm">Timeline</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
