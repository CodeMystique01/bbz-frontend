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
    APPROVED: "success", PENDING: "warning", REJECTED: "error",
};

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadProducts(); }, []);

    async function loadProducts() {
        setIsLoading(true);
        try { const data = await apiClient.get<Product[]>("/api/products/vendor/my-products"); setProducts(Array.isArray(data) ? data : []); }
        catch { setProducts([]); } finally { setIsLoading(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this product?")) return;
        try { await apiClient.delete(`/api/products/${id}`); setProducts((prev) => prev.filter((p) => p.id !== id)); toast.success("Product deleted"); }
        catch { toast.error("Failed to delete"); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">My Products</h1>
                    <p className="text-xs text-gray-400 mt-0.5">{products.length} products</p>
                </div>
                <Link href="/dashboard/vendor/products/new"><Button><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product</Button></Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <Package className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">No products yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start by adding your first digital product</p>
                    <Link href="/dashboard/vendor/products/new" className="mt-4 inline-block"><Button variant="outline"><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product</Button></Link>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Delivery</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Created</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                                                    <img src={product.imageUrl || "/placeholder-product.png"} alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23fafafa' width='100' height='100'/%3E%3C/svg%3E"; }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 text-xs">{formatPrice(product.price)}</td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{product.category || "—"}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                                                product.deliveryType === "EXTERNAL_URL" ? "bg-indigo-50 text-indigo-700" :
                                                product.deliveryType === "DOWNLOAD" ? "bg-green-50 text-green-700" :
                                                "bg-gray-50 text-gray-600"
                                            }`}>
                                                {product.deliveryType === "EXTERNAL_URL" ? "URL" :
                                                 product.deliveryType === "DOWNLOAD" ? "Download" : "Key"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><Badge variant={APPROVAL_COLORS[product.approvalStatus] || "default"}>{product.approvalStatus}</Badge></td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(product.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/dashboard/vendor/products/${product.id}/edit`} className="p-1.5 text-gray-300 hover:text-primary-600 transition-colors"><Edit className="h-3.5 w-3.5" /></Link>
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
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
