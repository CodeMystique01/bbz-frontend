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
        if (!isAuthenticated) { router.push("/login"); return; }
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
            const order = await apiClient.post<Order>("/api/orders", { cartItems, paymentMethod });
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

    if (placedOrder) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-sm w-full text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">Order Confirmed</h1>
                        <p className="text-sm text-gray-400 mb-6">
                            Order <span className="font-mono text-primary-600">#{placedOrder.id.slice(0, 8)}</span> placed successfully.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-medium text-gray-900">{formatPrice(placedOrder.totalAmount)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-medium text-amber-600">{placedOrder.status}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Items</span><span className="font-medium text-gray-900">{placedOrder.items?.length || 0}</span></div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => router.push(`/dashboard/buyer/orders`)}>View Orders</Button>
                            <Button className="flex-1" onClick={() => router.push("/products")}>Continue Shopping</Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-8">Checkout</h1>

                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">Your cart is empty</h3>
                        <p className="text-sm text-gray-400 mb-6">Add products before checking out</p>
                        <Button onClick={() => router.push("/products")}>Browse Products</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 space-y-5">
                            {/* Items */}
                            <div className="rounded-xl border border-gray-100 p-5">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">Items ({itemCount})</h2>
                                <div className="divide-y divide-gray-50">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                                                <img src={item.product.imageUrl || "/placeholder-product.png"} alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23fafafa' width='200' height='200'/%3E%3C/svg%3E"; }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                                                <p className="text-[11px] text-gray-300 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="rounded-xl border border-gray-100 p-5">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">Payment</h2>
                                <div className="space-y-2">
                                    {[
                                        { value: "ONLINE", label: "Online Payment", desc: "Pay via Razorpay", icon: CreditCard },
                                        { value: "COD", label: "Cash on Delivery", desc: "Pay on receipt", icon: Package },
                                    ].map((method) => (
                                        <label key={method.value}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === method.value ? "border-primary-300 bg-primary-50" : "border-gray-100 hover:border-gray-200"}`}>
                                            <input type="radio" name="paymentMethod" value={method.value} checked={paymentMethod === method.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)} className="text-primary-600 focus:ring-primary-500" />
                                            <method.icon className={`h-4 w-4 ${paymentMethod === method.value ? "text-primary-500" : "text-gray-300"}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{method.label}</p>
                                                <p className="text-[11px] text-gray-400">{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl border border-gray-100 p-5 sticky top-20">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Summary</h3>
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-gray-400"><span>Subtotal ({itemCount})</span><span className="text-gray-900">{formatPrice(total)}</span></div>
                                    <div className="flex justify-between text-gray-400"><span>Platform Fee</span><span className="text-gray-900">{formatPrice(0)}</span></div>
                                    <hr className="border-gray-50" />
                                    <div className="flex justify-between"><span className="font-medium text-gray-900">Total</span><span className="font-semibold text-gray-900">{formatPrice(total)}</span></div>
                                </div>
                                <Button className="w-full mt-5" size="lg" onClick={handlePlaceOrder} disabled={isPlacing}>
                                    {isPlacing ? (<><Spinner size="sm" className="mr-2" /> Placing...</>) : ("Place Order")}
                                </Button>
                                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-300">
                                    <ShieldCheck className="h-3 w-3" /><span>Secure checkout</span>
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
