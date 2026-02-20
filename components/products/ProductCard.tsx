"use client";

import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";

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
    return (
        <Link href={`/products/${id}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={imageUrl || "/placeholder-product.png"}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                />
                {category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-gray-700 shadow-sm">{category}</span>
                )}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className={cn("absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm", "text-gray-400 hover:text-red-500 transition-colors cursor-pointer")}>
                    <Heart className="h-4 w-4" />
                </button>
            </div>
            <div className="p-4">
                {vendorName && <p className="text-xs text-gray-400 mb-1">by {vendorName}</p>}
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{name}</h3>
                {description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{truncate(description, 80)}</p>}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(price)}</p>
                    <div className="flex items-center gap-2">
                        {averageRating && (
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                <span className="font-medium">{averageRating.toFixed(1)}</span>
                            </div>
                        )}
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors cursor-pointer">
                            <ShoppingCart className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
