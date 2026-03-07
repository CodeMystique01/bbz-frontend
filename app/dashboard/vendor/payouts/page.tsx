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
                    <h1 className="text-xl font-semibold text-gray-900">Payouts</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Track your earnings and payout requests</p>
                </div>
                <Button onClick={requestPayout} disabled={isRequesting}>
                    {isRequesting ? "Requesting..." : <><ArrowUpRight className="h-4 w-4 mr-2" /> Request Payout</>}
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: DollarSign, label: "Total Earnings", value: formatPrice(earnings.totalEarnings), color: "text-green-500" },
                    { icon: Clock, label: "Pending", value: formatPrice(earnings.pendingEarnings), color: "text-amber-500" },
                    { icon: CheckCircle, label: "Paid", value: formatPrice(earnings.paidEarnings), color: "text-emerald-500" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                        <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                        <p className="text-xl font-semibold text-gray-900">{s.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Payout History */}
            <div className="rounded-xl border border-gray-100">
                <div className="p-4 border-b border-gray-50"><h2 className="text-sm font-medium text-gray-900">Payout History</h2></div>
                {(earnings.payouts?.length ?? 0) === 0 ? (
                    <div className="p-8 text-center"><DollarSign className="h-8 w-8 text-gray-200 mx-auto mb-2" /><p className="text-xs text-gray-400">No payouts yet</p></div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-50 text-left">
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">ID</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Requested</th>
                                    <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Processed</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {earnings.payouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 font-mono text-xs text-primary-600">#{payout.id.slice(0, 8)}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 text-xs">{formatPrice(payout.amount)}</td>
                                            <td className="px-4 py-3"><Badge variant={STATUS_COLORS[payout.status] || "default"}>{payout.status}</Badge></td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(payout.createdAt)}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{payout.processedAt ? formatDate(payout.processedAt) : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {earnings.totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-xs">
                                <span className="text-gray-400">Page {page} of {earnings.totalPages}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronLeft className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => setPage((p) => Math.min(earnings.totalPages, p + 1))} disabled={page === earnings.totalPages} className="p-1 rounded border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronRight className="h-3.5 w-3.5" /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
