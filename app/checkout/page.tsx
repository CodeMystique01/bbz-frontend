"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, CheckCircle2, Package } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";
import { Navbar, PageContainer } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Button, Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { RazorpayOrderResponse, RazorpaySuccessResponse, PaymentVerifyResponse } from "@/lib/types";

// ── Razorpay type declarations ──────────────────────────────
declare global {
    interface Window {
        Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
    }
}

interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpaySuccessResponse) => void;
    prefill?: { email?: string; name?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

// ── Load Razorpay script ────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, itemCount, fetchCart, reset } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState<{
        orderId: string;
        amount: number;
        paymentId: string;
    } | null>(null);

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        fetchCart();
    }, [isAuthenticated, router, fetchCart]);

    const handlePayment = useCallback(async () => {
        if (items.length === 0) return;

        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
            toast.error("Payment is not configured. Please contact support.");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                toast.error("Failed to load payment gateway. Please try again.");
                setIsProcessing(false);
                return;
            }

            // 2. Create Razorpay order via backend
            const cartItems = items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            }));

            const razorpayOrder = await apiClient.post<RazorpayOrderResponse>(
                "/api/payments/cart/purchase",
                { items: cartItems }
            );

            // 3. Open Razorpay checkout modal
            const options: RazorpayCheckoutOptions = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency || "INR",
                name: "BuyBizz",
                description: `Payment for ${itemCount} item${itemCount > 1 ? "s" : ""}`,
                order_id: razorpayOrder.id,
                handler: async (response: RazorpaySuccessResponse) => {
                    try {
                        const verification = await apiClient.post<PaymentVerifyResponse>(
                            "/api/payments/verify",
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }
                        );
                        setOrderConfirmed({
                            orderId: verification.orderId,
                            amount: razorpayOrder.amount,
                            paymentId: verification.paymentId,
                        });
                        reset();
                        toast.success("Payment successful!");
                    } catch {
                        setOrderConfirmed({
                            orderId: razorpayOrder.id,
                            amount: razorpayOrder.amount,
                            paymentId: response.razorpay_payment_id,
                        });
                        reset();
                        toast.success("Payment received! Your order will be confirmed shortly.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    email: user?.email || "",
                    name: user?.name || "",
                },
                theme: {
                    color: "#2563eb",
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        toast.info("Payment cancelled");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to initiate payment");
            setIsProcessing(false);
        }
    }, [items, itemCount, user, reset]);

    if (!isAuthenticated) return null;

    // ── Success screen ──────────────────────────────────────
    if (orderConfirmed) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-sm w-full text-center animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">Payment Successful</h1>
                        <p className="text-sm text-gray-400 mb-6">
                            Your order has been confirmed and payment received.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount Paid</span>
                                <span className="font-medium text-gray-900">{formatPrice(orderConfirmed.amount / 100)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Payment ID</span>
                                <span className="font-mono text-xs text-primary-600">{orderConfirmed.paymentId.slice(0, 18)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="font-medium text-green-600">Paid</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => router.push("/dashboard/buyer/orders")}>View Orders</Button>
                            <Button className="flex-1" onClick={() => router.push("/products")}>Continue Shopping</Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ── Checkout screen ─────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <PageContainer className="flex-1 py-8">
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

                            {/* Payment Info */}
                            <div className="rounded-xl border border-gray-100 p-5">
                                <h2 className="text-sm font-medium text-gray-900 mb-3">Payment</h2>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-primary-200 bg-primary-50">
                                    <CreditCard className="h-4 w-4 text-primary-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Online Payment</p>
                                        <p className="text-[11px] text-gray-400">Pay securely via Razorpay (UPI, Cards, Netbanking)</p>
                                    </div>
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
                                <Button className="w-full mt-5" size="lg" onClick={handlePayment} disabled={isProcessing}>
                                    {isProcessing ? (<><Spinner size="sm" className="mr-2" /> Processing...</>) : ("Pay Now")}
                                </Button>
                                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-300">
                                    <ShieldCheck className="h-3 w-3" /><span>Secured by Razorpay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>

            <Footer />
        </div>
    );
}
