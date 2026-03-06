"use client";

import { useEffect, useState } from "react";
import { Key, Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Spinner, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

interface License {
    id: string;
    licenseKey: string;
    assigned: boolean;
    assignedAt: string | null;
    product: { id: string; name: string; imageUrl: string | null };
    createdAt: string;
}

export default function BuyerLicensesPage() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { loadLicenses(); }, [page]);

    async function loadLicenses() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "10");
            const res = await apiClient.get<{ licenses: License[]; totalPages: number } | License[]>(
                `/api/licenses/me?${params.toString()}`
            );
            if (Array.isArray(res)) {
                setLicenses(res);
                setTotalPages(1);
            } else {
                setLicenses(res.licenses || []);
                setTotalPages(res.totalPages || 1);
            }
        } catch { setLicenses([]); } finally { setIsLoading(false); }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">My Licenses</h1>
                <p className="text-xs text-gray-400 mt-0.5">License keys for your purchased products</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : licenses.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <Key className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">No licenses yet</p>
                    <p className="text-xs text-gray-400 mt-1">Purchase products to receive license keys</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">License Key</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Assigned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {licenses.map((lic) => (
                                    <tr key={lic.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={lic.product.imageUrl || "/placeholder-product.png"} alt={lic.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E"; }}
                                                    />
                                                </div>
                                                <span className="font-medium text-gray-900 truncate max-w-[200px]">{lic.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="px-2 py-1 bg-gray-50 rounded text-xs font-mono text-gray-700 select-all">{lic.licenseKey}</code>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={lic.assigned ? "success" : "warning"}>{lic.assigned ? "Active" : "Pending"}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{lic.assignedAt ? formatDate(lic.assignedAt) : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-xs">
                            <span className="text-gray-400">Page {page} of {totalPages}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
