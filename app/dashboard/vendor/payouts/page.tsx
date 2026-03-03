"use client";

import { useEffect, useState } from "react";
import { DollarSign, ArrowUpRight, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Spinner, Badge, Button } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface PayoutRequest {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    processedAt: string | null;
}

interface EarningsData {
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    payouts: PayoutRequest[];
    totalPages: number;
}

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    COMPLETED: "success", PAID: "success",
    PENDING: "warning", PROCESSING: "warning",
    REJECTED: "error", FAILED: "error",
};

export default function VendorPayoutsPage() {
    const [data, setData] = useState<EarningsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => { loadEarnings(); }, [page]);

    async function loadEarnings() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "10");
            const res = await apiClient.get<EarningsData>(`/api/payouts/earnings?${params.toString()}`);
            setData(res);
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    async function requestPayout() {
        setIsRequesting(true);
        try {
            await apiClient.post("/api/payouts/requests");
            toast.success("Payout request submitted!");
            loadEarnings();
        } catch { toast.error("Failed to request payout"); } finally { setIsRequesting(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const earnings = data || { totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0, payouts: [], totalPages: 1 };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your earnings and payout requests</p>
                </div>
                <Button onClick={requestPayout} disabled={isRequesting}>
                    {isRequesting ? "Requesting..." : <><ArrowUpRight className="h-4 w-4 mr-2" /> Request Payout</>}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-2"><DollarSign className="h-5 w-5 opacity-80" /><span className="text-sm opacity-80">Total Earnings</span></div>
                    <p className="text-3xl font-bold">{formatPrice(earnings.totalEarnings)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-2"><Clock className="h-5 w-5 text-amber-500" /><span className="text-sm text-gray-500">Pending</span></div>
                    <p className="text-3xl font-bold text-gray-900">{formatPrice(earnings.pendingEarnings)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-sm text-gray-500">Paid</span></div>
                    <p className="text-3xl font-bold text-gray-900">{formatPrice(earnings.paidEarnings)}</p>
                </div>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Payout History</h2></div>
                {earnings.payouts.length === 0 ? (
                    <div className="p-8 text-center"><DollarSign className="h-8 w-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No payouts yet</p></div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">ID</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Amount</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Requested</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Processed</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {earnings.payouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-mono text-xs text-primary-600">#{payout.id.slice(0, 8)}</td>
                                            <td className="px-5 py-4 font-semibold text-gray-900">{formatPrice(payout.amount)}</td>
                                            <td className="px-5 py-4"><Badge variant={STATUS_COLORS[payout.status] || "default"}>{payout.status}</Badge></td>
                                            <td className="px-5 py-4 text-gray-500">{formatDate(payout.createdAt)}</td>
                                            <td className="px-5 py-4 text-gray-500">{payout.processedAt ? formatDate(payout.processedAt) : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {earnings.totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                                <span className="text-gray-500">Page {page} of {earnings.totalPages}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronLeft className="h-4 w-4" /></button>
                                    <button onClick={() => setPage((p) => Math.min(earnings.totalPages, p + 1))} disabled={page === earnings.totalPages} className="p-1.5 rounded border border-gray-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronRight className="h-4 w-4" /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
