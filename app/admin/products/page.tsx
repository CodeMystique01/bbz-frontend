"use client";

import { useEffect, useState } from "react";
import { Package, CheckCircle, XCircle, Eye } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<"pending" | "all">("pending");

    useEffect(() => { loadProducts(); }, [tab]);

    async function loadProducts() {
        setIsLoading(true);
        try {
            const endpoint = tab === "pending" ? "/api/admin/products/pending" : "/api/admin/products";
            const data = await apiClient.get<Product[] | { products: Product[] }>(endpoint);
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleApprove(id: string) {
        try {
            await apiClient.post(`/api/admin/products/${id}/approve`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product approved");
        } catch {
            toast.error("Failed to approve product");
        }
    }

    async function handleReject(id: string) {
        try {
            await apiClient.post(`/api/admin/products/${id}/reject`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product rejected");
        } catch {
            toast.error("Failed to reject product");
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Moderation</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve vendor product submissions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                {(["pending", "all"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t === "pending" ? "Pending Review" : "All Products"}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">{tab === "pending" ? "No products pending review" : "No products found"}</p>
                    <p className="text-sm text-gray-500 mt-1">{tab === "pending" ? "All caught up! 🎉" : ""}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Product</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Price</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Category</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Submitted</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={product.imageUrl || "/placeholder-product.png"} alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E"; }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.vendor?.email || "Unknown vendor"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                                        <td className="px-5 py-4 text-gray-500">{product.category || "—"}</td>
                                        <td className="px-5 py-4">
                                            <Badge variant={product.approvalStatus === "APPROVED" ? "success" : product.approvalStatus === "REJECTED" ? "error" : "warning"}>
                                                {product.approvalStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{formatDate(product.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer"
                                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                {product.approvalStatus === "PENDING" && (
                                                    <>
                                                        <button onClick={() => handleApprove(product.id)} title="Approve"
                                                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => handleReject(product.id)} title="Reject"
                                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
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
