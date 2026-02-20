"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Button, Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const router = useRouter();
    const { items, isLoading, itemCount, total, fetchCart, updateQuantity, removeItem, clearCart } =
        useCartStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        fetchCart();
    }, [isAuthenticated, router, fetchCart]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-sm text-gray-500 mt-1">{itemCount} {itemCount === 1 ? "item" : "items"} in your cart</p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {isLoading && items.length === 0 ? (
                    <div className="flex justify-center py-24">
                        <Spinner size="lg" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 text-sm mb-6">Browse products and add items to your cart</p>
                        <Link href="/products">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-gray-200 p-5 flex gap-5 hover:shadow-sm transition-shadow"
                                >
                                    {/* Product Image */}
                                    <Link href={`/products/${item.productId}`} className="shrink-0">
                                        <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden">
                                            <img
                                                src={item.product.imageUrl || "/placeholder-product.png"}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${item.productId}`}>
                                            <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        {item.product.category && (
                                            <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>
                                        )}
                                        <p className="text-lg font-bold text-gray-900 mt-2">
                                            {formatPrice(item.product.price)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="text-sm font-medium text-gray-900 w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
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
                                <Link href="/checkout" className="block mt-6">
                                    <Button className="w-full" size="lg">
                                        Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link
                                    href="/products"
                                    className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-3"
                                >
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
