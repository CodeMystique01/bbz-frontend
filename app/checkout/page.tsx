"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, CheckCircle2, Package } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Button, Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Order } from "@/lib/types";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, itemCount, fetchCart, reset } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isPlacing, setIsPlacing] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("ONLINE");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchCart();
    }, [isAuthenticated, router, fetchCart]);

    async function handlePlaceOrder() {
        if (items.length === 0) return;
        setIsPlacing(true);
        try {
            const cartItems = items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));

            const order = await apiClient.post<Order>("/api/orders", {
                cartItems,
                paymentMethod,
            });

            setPlacedOrder(order);
            reset();
            toast.success("Order placed successfully!");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to place order");
        } finally {
            setIsPlacing(false);
        }
    }

    if (!isAuthenticated) return null;

    // Order Confirmation
    if (placedOrder) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-lg w-full text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500 mb-6">
                            Your order <span className="font-mono text-primary-600 font-medium">#{placedOrder.id.slice(0, 8)}</span> has been placed successfully.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Amount</span>
                                <span className="font-semibold text-gray-900">{formatPrice(placedOrder.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium text-amber-600">{placedOrder.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Items</span>
                                <span className="font-medium text-gray-900">{placedOrder.items?.length || 0}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.push(`/dashboard/buyer/orders`)}
                            >
                                View Orders
                            </Button>
                            <Button className="flex-1" onClick={() => router.push("/products")}>
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 text-sm mb-6">Add products to your cart before checking out</p>
                        <Button onClick={() => router.push("/products")}>Browse Products</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Items Review */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">Order Items ({itemCount})</h2>
                                <div className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                <img
                                                    src={item.product.imageUrl || "/placeholder-product.png"}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900 text-sm shrink-0">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    {[
                                        { value: "ONLINE", label: "Online Payment", desc: "Pay securely via Razorpay", icon: CreditCard },
                                        { value: "COD", label: "Cash on Delivery", desc: "Pay when you receive the product", icon: Package },
                                    ].map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === method.value
                                                    ? "border-primary-500 bg-primary-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="text-primary-600 focus:ring-primary-500"
                                            />
                                            <method.icon className={`h-5 w-5 ${paymentMethod === method.value ? "text-primary-600" : "text-gray-400"}`} />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{method.label}</p>
                                                <p className="text-xs text-gray-500">{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span className="text-gray-900 font-medium">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Platform Fee</span>
                                        <span className="text-gray-900 font-medium">{formatPrice(0)}</span>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between text-base">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-6"
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacing}
                                >
                                    {isPlacing ? (
                                        <><Spinner size="sm" className="mr-2" /> Placing Order...</>
                                    ) : (
                                        <>Place Order</>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
