"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart, Star, Package, User, Minus, Plus } from "lucide-react";
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
    const [quantity, setQuantity] = useState(1);
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
        if (!isAuthenticated) { router.push("/login"); return; }
        setAddingToCart(true);
        try {
            await addItem(productId, quantity);
            toast.success(`Added ${quantity > 1 ? `${quantity} items` : ""} to cart!`);
            setQuantity(1);
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    }

    async function handleToggleWishlist() {
        if (!isAuthenticated) { router.push("/login"); return; }
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
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center"><Spinner size="lg" /></div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center py-24">
                    <Package className="h-12 w-12 text-gray-200 mb-4" />
                    <h2 className="text-lg font-medium text-gray-900 mb-1">Product not found</h2>
                    <p className="text-sm text-gray-400 mb-6">This product doesn&apos;t exist or has been removed.</p>
                    <Button onClick={() => router.push("/products")}>Browse Products</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div style={{ flex: 1, maxWidth: 1100, marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: 24, paddingRight: 24, paddingTop: 32, paddingBottom: 48 }}>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-6 cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                {/* Product Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image */}
                    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative">
                        <img
                            src={product.imageUrl || "/placeholder-product.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect fill='%23fafafa' width='600' height='600'/%3E%3Ctext fill='%23d4d4d8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                        />
                        {product.category && (
                            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-xs font-medium text-gray-500">
                                {product.category}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        {product.vendor && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                <User className="h-3 w-3" />
                                <span>by {product.vendor.name || product.vendor.email}</span>
                            </div>
                        )}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                            <button
                                onClick={handleToggleWishlist}
                                className={`p-2.5 rounded-full border transition-colors cursor-pointer shrink-0 ${wishlisted
                                    ? "bg-red-50 border-red-100 text-red-400"
                                    : "bg-gray-50 border-gray-100 text-gray-300 hover:text-red-400"
                                    }`}
                            >
                                <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-400" : ""}`} />
                            </button>
                        </div>

                        {product.averageRating && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3.5 w-3.5 ${i < Math.round(product.averageRating!)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{product.averageRating.toFixed(1)}</span>
                                <span className="text-xs text-gray-300">({product.totalReviews || 0} reviews)</span>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">{product.description}</p>

                        {/* Price & Actions */}
                        <div className="border-t border-gray-50 pt-6 mt-auto">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-0.5">Price</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                                </div>
                                <Badge variant={product.approvalStatus === "APPROVED" ? "success" : "warning"}>
                                    {product.approvalStatus}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-sm text-gray-500">Quantity</span>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                        className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="text-sm font-medium text-gray-900 w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full" size="lg">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                {addingToCart ? "Adding..." : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-14">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Reviews ({reviews.length})</h2>

                    {/* Review Submission Form */}
                    {isAuthenticated && (
                        <ReviewForm productId={productId} onSubmitted={() => loadReviews()} />
                    )}

                    {reviews.length === 0 ? (
                        <div className="border border-gray-100 rounded-xl p-10 text-center">
                            <Star className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                                                {(review.user?.name || review.user?.email || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{review.user?.name || review.user?.email || "Anonymous"}</p>
                                                <p className="text-[11px] text-gray-300">{formatDate(review.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{review.comment}</p>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await apiClient.post(`/api/reviews/${review.id}/helpful`);
                                                toast.success("Marked as helpful");
                                            } catch { toast.error("Already voted"); }
                                        }}
                                        className="text-xs text-gray-400 hover:text-primary-600 transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                        👍 Helpful
                                    </button>
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

function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) { toast.error("Please select a rating"); return; }
        setIsSubmitting(true);
        try {
            await apiClient.post("/api/reviews", { productId, rating, comment });
            toast.success("Review submitted!");
            setRating(0); setComment("");
            onSubmitted();
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error.message || "Failed to submit review");
        } finally { setIsSubmitting(false); }
    }

    return (
        <form onSubmit={handleSubmit} className="border border-gray-100 rounded-xl p-5 mb-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Write a Review</p>
            <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                    <button key={i} type="button"
                        onMouseEnter={() => setHover(i + 1)} onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(i + 1)}
                        className="cursor-pointer">
                        <Star className={`h-5 w-5 transition-colors ${(hover || rating) > i ? "fill-amber-400 text-amber-400" : "text-gray-200"
                            }`} />
                    </button>
                ))}
                {rating > 0 && <span className="text-xs text-gray-400 ml-2">{rating}/5</span>}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none mb-3" />
            <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
