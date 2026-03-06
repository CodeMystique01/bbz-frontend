"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

interface ProductCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    category?: string;
    averageRating?: number | null;
    vendorName?: string;
}

export function ProductCard({
    id, name, description, price, imageUrl, category, averageRating, vendorName,
}: ProductCardProps) {
    const router = useRouter();
    const { addItem } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [addingToCart, setAddingToCart] = useState(false);

    async function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) { router.push("/login"); return; }
        setAddingToCart(true);
        try {
            await addItem(id);
            toast.success("Added to cart!");
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    }

    return (
        <Link href={`/products/${id}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200">
            <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                <img
                    src={imageUrl || "/placeholder-product.png"}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23fafafa' width='400' height='300'/%3E%3Ctext fill='%23d4d4d8' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                />
                {category && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur text-[11px] font-medium text-gray-500">{category}</span>
                )}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className={cn("absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur", "text-gray-300 hover:text-red-400 transition-colors cursor-pointer")}>
                    <Heart className="h-3.5 w-3.5" />
                </button>
            </div>
            <div className="p-4">
                {vendorName && <p className="text-[11px] text-gray-300 mb-1">by {vendorName}</p>}
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{name}</h3>
                {description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{truncate(description, 80)}</p>}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-base font-semibold text-gray-900">{formatPrice(price)}</p>
                    <div className="flex items-center gap-1.5">
                        {averageRating && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span>{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="p-1.5 rounded-md bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addingToCart
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <ShoppingCart className="h-3.5 w-3.5" />}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
