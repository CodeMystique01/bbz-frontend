"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart, Star, Package, User } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product, Review } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Button, Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    const { addItem } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!productId) return;
        loadProduct();
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function loadProduct() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<Product>(`/api/products/${productId}`);
            setProduct(data);
        } catch {
            setProduct(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function loadReviews() {
        try {
            const data = await apiClient.get<Review[]>(`/api/reviews?productId=${productId}`);
            setReviews(Array.isArray(data) ? data : []);
        } catch {
            setReviews([]);
        }
    }

    async function handleAddToCart() {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        setAddingToCart(true);
        try {
            await addItem(productId);
            toast.success("Added to cart!");
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    }

    async function handleToggleWishlist() {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        try {
            if (wishlisted) {
                await apiClient.delete(`/api/wishlist/${productId}`);
                setWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                await apiClient.post("/api/wishlist", { productId });
                setWishlisted(true);
                toast.success("Added to wishlist!");
            }
        } catch {
            toast.error("Failed to update wishlist");
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Button onClick={() => router.push("/products")}>Browse Products</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to products
                </button>

                {/* Product Detail */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="aspect-square bg-gray-100 relative">
                            <img
                                src={product.imageUrl || "/placeholder-product.png"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect fill='%23f1f5f9' width='600' height='600'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                            />
                            {product.category && (
                                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-gray-700 shadow-sm">
                                    {product.category}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-8 lg:p-10 flex flex-col">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    {product.vendor && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                            <User className="h-3.5 w-3.5" />
                                            <span>by {product.vendor.name || product.vendor.email}</span>
                                        </div>
                                    )}
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
                                </div>
                                <button
                                    onClick={handleToggleWishlist}
                                    className={`p-3 rounded-full border transition-colors cursor-pointer ${wishlisted
                                            ? "bg-red-50 border-red-200 text-red-500"
                                            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                                        }`}
                                >
                                    <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
                                </button>
                            </div>

                            {/* Rating */}
                            {product.averageRating && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.round(product.averageRating!)
                                                        ? "fill-amber-500 text-amber-500"
                                                        : "text-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{product.averageRating.toFixed(1)}</span>
                                    <span className="text-sm text-gray-400">({product.totalReviews || 0} reviews)</span>
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6 flex-1">{product.description}</p>

                            {/* Price & Actions */}
                            <div className="border-t border-gray-100 pt-6 mt-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Price</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                                    </div>
                                    <Badge variant={product.approvalStatus === "APPROVED" ? "success" : "warning"}>
                                        {product.approvalStatus}
                                    </Badge>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="flex-1"
                                        size="lg"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {addingToCart ? "Adding..." : "Add to Cart"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews ({reviews.length})</h2>
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                                                {(review.user?.name || review.user?.email || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{review.user?.name || review.user?.email || "Anonymous"}</p>
                                                <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < review.rating
                                                            ? "fill-amber-500 text-amber-500"
                                                            : "text-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
