"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useCartStore } from "@/store/cart-store";
import type { WishlistItem } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCartStore();

    useEffect(() => {
        loadWishlist();
    }, []);

    async function loadWishlist() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<WishlistItem[]>("/api/wishlist");
            setItems(Array.isArray(data) ? data : []);
        } catch {
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemove(productId: string) {
        try {
            await apiClient.delete(`/api/wishlist/${productId}`);
            setItems((prev) => prev.filter((i) => i.productId !== productId));
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove from wishlist");
        }
    }

    async function handleAddToCart(productId: string) {
        try {
            await addItem(productId);
            toast.success("Added to cart!");
        } catch {
            toast.error("Failed to add to cart");
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
                <p className="text-sm text-gray-500 mt-1">{items.length} saved products</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Heart className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">Your wishlist is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Browse products and save items you love</p>
                    <Link href="/products" className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Browse Products →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
                            <Link href={`/products/${item.productId}`}>
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                    <img
                                        src={item.product.imageUrl || "/placeholder-product.png"}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/products/${item.productId}`}>
                                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">{item.product.name}</h3>
                                </Link>
                                <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.product.price)}</p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleAddToCart(item.productId)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors cursor-pointer"
                                    >
                                        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
