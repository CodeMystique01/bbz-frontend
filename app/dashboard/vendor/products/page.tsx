"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { Spinner, Badge, Button } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const APPROVAL_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    APPROVED: "success",
    PENDING: "warning",
    REJECTED: "error",
};

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadProducts(); }, []);

    async function loadProducts() {
        setIsLoading(true);
        try {
            const data = await apiClient.get<Product[]>("/api/products/vendor/my-products");
            setProducts(Array.isArray(data) ? data : []);
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await apiClient.delete(`/api/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted");
        } catch {
            toast.error("Failed to delete product");
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
                </div>
                <Link href="/dashboard/vendor/products/new">
                    <Button><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No products yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start by adding your first digital product</p>
                    <Link href="/dashboard/vendor/products/new" className="mt-4 inline-block">
                        <Button variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Product</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Price</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Created</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    <img
                                                        src={product.imageUrl || "/placeholder-product.png"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </div>
                                                <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                                        <td className="px-5 py-4 text-gray-500">{product.category || "—"}</td>
                                        <td className="px-5 py-4">
                                            <Badge variant={APPROVAL_COLORS[product.approvalStatus] || "default"}>{product.approvalStatus}</Badge>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{formatDate(product.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/vendor/products/${product.id}/edit`}
                                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
