"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Button, Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
    const router = useRouter();
    const { items, isLoading, itemCount, total, fetchCart, updateQuantity, removeItem, clearCart } =
        useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [confirmingClear, setConfirmingClear] = useState(false);
    const [busyItems, setBusyItems] = useState<Set<string>>(new Set());
    const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        fetchCart();
    }, [isAuthenticated, router, fetchCart]);

    const debouncedUpdateQuantity = useCallback((productId: string, quantity: number) => {
        const existing = debounceTimers.current.get(productId);
        if (existing) clearTimeout(existing);

        debounceTimers.current.set(productId, setTimeout(async () => {
            debounceTimers.current.delete(productId);
            setBusyItems(prev => new Set(prev).add(productId));
            try {
                await updateQuantity(productId, quantity);
            } catch {
                toast.error("Failed to update quantity");
            } finally {
                setBusyItems(prev => { const next = new Set(prev); next.delete(productId); return next; });
            }
        }, 400));
    }, [updateQuantity]);

    async function handleRemoveItem(productId: string) {
        setBusyItems(prev => new Set(prev).add(productId));
        try {
            await removeItem(productId);
        } catch {
            toast.error("Failed to remove item");
        } finally {
            setBusyItems(prev => { const next = new Set(prev); next.delete(productId); return next; });
        }
    }

    async function handleClearCart() {
        if (!confirmingClear) {
            setConfirmingClear(true);
            setTimeout(() => setConfirmingClear(false), 3000);
            return;
        }
        setConfirmingClear(false);
        try {
            await clearCart();
        } catch {
            toast.error("Failed to clear cart");
        }
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Shopping Cart</h1>
                        <p className="text-xs text-gray-400 mt-0.5">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className={`text-xs transition-colors cursor-pointer ${confirmingClear ? "text-red-500 font-medium" : "text-gray-400 hover:text-red-500"}`}
                        >
                            {confirmingClear ? "Click again to confirm" : "Clear Cart"}
                        </button>
                    )}
                </div>

                {isLoading && items.length === 0 ? (
                    <div className="flex justify-center py-24"><Spinner size="lg" /></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">Your cart is empty</h3>
                        <p className="text-sm text-gray-400 mb-6">Browse products and add items to your cart</p>
                        <Link href="/products"><Button>Browse Products</Button></Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => {
                                const isBusy = busyItems.has(item.productId);
                                return (
                                    <div key={item.id} className={`rounded-xl border border-gray-100 p-4 flex gap-4 hover:border-gray-200 transition-colors ${isBusy ? "opacity-60 pointer-events-none" : ""}`}>
                                        <Link href={`/products/${item.productId}`} className="shrink-0">
                                            <div className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden">
                                                <img
                                                    src={item.product.imageUrl || "/placeholder-product.png"}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23fafafa' width='200' height='200'/%3E%3Ctext fill='%23d4d4d8' font-family='sans-serif' font-size='11' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.productId}`}>
                                                <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">{item.product.name}</h3>
                                            </Link>
                                            {item.product.category && <p className="text-[11px] text-gray-300 mt-0.5">{item.product.category}</p>}
                                            <p className="text-base font-semibold text-gray-900 mt-1.5">{formatPrice(item.product.price)}</p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => handleRemoveItem(item.productId)} className="p-1 text-gray-300 hover:text-red-400 transition-colors cursor-pointer">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-md">
                                                <button onClick={() => debouncedUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}
                                                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-medium text-gray-900 w-5 text-center">{item.quantity}</span>
                                                <button onClick={() => debouncedUpdateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer">
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-xl border border-gray-100 p-5 sticky top-20">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Summary</h3>
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({itemCount})</span>
                                        <span className="text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Platform Fee</span>
                                        <span className="text-gray-900">{formatPrice(0)}</span>
                                    </div>
                                    <hr className="border-gray-50" />
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-900">Total</span>
                                        <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" className="block mt-5">
                                    <Button className="w-full" size="lg">
                                        Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
                                    </Button>
                                </Link>
                                <Link href="/products" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-3">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
