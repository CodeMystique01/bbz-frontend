"use client";

import { useEffect, useState } from "react";
import { Shield, Check, X, Package, Filter } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const APPROVAL_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    APPROVED: "success", PENDING: "warning", REJECTED: "error",
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<"pending" | "all">("pending");

    useEffect(() => { loadProducts(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [view]);

    async function loadProducts() {
        setIsLoading(true);
        try {
            const endpoint = view === "pending" ? "/api/admin/products/pending" : "/api/admin/products";
            const data = await apiClient.get<Product[]>(endpoint);
            setProducts(Array.isArray(data) ? data : []);
        } catch { setProducts([]); } finally { setIsLoading(false); }
    }

    async function handleAction(id: string, action: "approve" | "reject") {
        try {
            const status = action === "approve" ? "APPROVED" : "REJECTED";
            await apiClient.put(`/api/admin/products/${id}`, { approvalStatus: status });
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success(`Product ${action}d`);
        } catch { toast.error(`Failed to ${action} product`); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Product Moderation</h1>
                <p className="text-xs text-gray-400 mt-0.5">Review and approve vendor products</p>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-300" />
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    <button onClick={() => setView("pending")}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${view === "pending" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        Pending
                    </button>
                    <button onClick={() => setView("all")}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${view === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        All
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <Shield className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{view === "pending" ? "No products pending review" : "No products found"}</p>
                    <p className="text-xs text-gray-400 mt-1">Products submitted by vendors will appear here</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Vendor</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Delivery</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Submitted</th>
                                    {view === "pending" && <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Actions</th>}
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
                                        <td className="px-4 py-3 text-gray-400 text-xs">{product.vendor?.name || product.vendor?.email || "—"}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 text-xs">{formatPrice(product.price)}</td>
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
                                        {view === "pending" && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleAction(product.id, "approve")}
                                                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-md transition-colors cursor-pointer" title="Approve">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => handleAction(product.id, "reject")}
                                                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Reject">
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
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
