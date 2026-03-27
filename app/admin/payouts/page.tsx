"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Filter,
    RefreshCw,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    Banknote,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { PayoutRequest, PayoutRequestsResponse, AdminPayoutsSummary } from "@/lib/types";
import { Spinner, Badge, Button } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS = ["", "PENDING", "APPROVED", "PROCESSING", "COMPLETED", "FAILED", "REJECTED", "CANCELLED"];

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default" | "primary"> = {
    COMPLETED: "success",
    APPROVED: "primary",
    PENDING: "warning",
    PROCESSING: "warning",
    FAILED: "error",
    REJECTED: "error",
    CANCELLED: "error",
};

const METHOD_LABELS: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    UPI: "UPI",
    WALLET: "Wallet",
};

export default function AdminPayoutsPage() {
    const [summary, setSummary] = useState<AdminPayoutsSummary | null>(null);
    const [requests, setRequests] = useState<PayoutRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isReleasing, setIsReleasing] = useState(false);

    useEffect(() => {
        loadSummary();
    }, []);

    useEffect(() => {
        loadRequests();
    }, [page, statusFilter]);

    async function loadSummary() {
        setIsSummaryLoading(true);
        try {
            const res = await apiClient.get<AdminPayoutsSummary>("/api/admin/payouts");
            setSummary(res);
        } catch {
            toast.error("Failed to load payout summary");
        } finally {
            setIsSummaryLoading(false);
        }
    }

    async function loadRequests() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "15");
            if (statusFilter) params.set("status", statusFilter);

            const res = await apiClient.get<PayoutRequestsResponse>(
                `/api/payouts/requests?${params.toString()}`
            );
            setRequests(res.requests || []);
            setTotalPages(res.totalPages || 1);
        } catch {
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleApprove(id: string) {
        setActionLoading(id);
        try {
            await apiClient.put(`/api/payouts/requests/${id}/approve`, {
                status: "APPROVED",
            });
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r))
            );
            toast.success("Payout request approved");
            loadSummary();
        } catch {
            toast.error("Failed to approve payout request");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleReject(id: string) {
        setActionLoading(id);
        try {
            await apiClient.put(`/api/payouts/requests/${id}/approve`, {
                status: "REJECTED",
                adminNotes: "Rejected by admin",
            });
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" as const } : r))
            );
            toast.success("Payout request rejected");
            loadSummary();
        } catch {
            toast.error("Failed to reject payout request");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleProcess(id: string) {
        setActionLoading(id);
        try {
            await apiClient.post(`/api/payouts/requests/${id}/process`);
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "PROCESSING" as const } : r))
            );
            toast.success("Payout processing initiated via RazorpayX");
            loadSummary();
        } catch {
            toast.error("Failed to process payout");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleBufferRelease() {
        setIsReleasing(true);
        try {
            const res = await apiClient.post<{ released: number }>("/api/admin/payouts/release");
            toast.success(`Released ${res.released} earnings from buffer`);
            loadSummary();
        } catch {
            toast.error("Failed to release buffer earnings");
        } finally {
            setIsReleasing(false);
        }
    }

    const summaryCards = summary
        ? [
              {
                  icon: TrendingUp,
                  label: "Commission Earned (35%)",
                  value: formatPrice(summary.totalCommissionEarned),
                  color: "text-blue-600",
                  bg: "bg-blue-50",
              },
              {
                  icon: Clock,
                  label: "Pending Payouts",
                  value: formatPrice(summary.pendingPayouts),
                  color: "text-amber-600",
                  bg: "bg-amber-50",
              },
              {
                  icon: CheckCircle,
                  label: "Completed Payouts",
                  value: formatPrice(summary.completedPayouts),
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
              },
              {
                  icon: XCircle,
                  label: "Failed Payouts",
                  value: formatPrice(summary.failedPayouts),
                  color: "text-red-600",
                  bg: "bg-red-50",
              },
          ]
        : [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review, approve, and process vendor payout requests
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBufferRelease}
                        disabled={isReleasing}
                        leftIcon={<RefreshCw className={`h-4 w-4 ${isReleasing ? "animate-spin" : ""}`} />}
                    >
                        {isReleasing ? "Releasing..." : "Release Buffer"}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {isSummaryLoading ? (
                <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryCards.map((card) => (
                            <div
                                key={card.label}
                                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
                            >
                                <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Platform Stats Row */}
                    {summary && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                                <div className="inline-flex p-2 rounded-lg bg-indigo-50">
                                    <Banknote className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatPrice(summary.totalSalesVolume)}
                                    </p>
                                    <p className="text-[11px] text-gray-400">Total Sales Volume</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                                <div className="inline-flex p-2 rounded-lg bg-violet-50">
                                    <ArrowUpRight className="h-4 w-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatPrice(summary.totalVendorEarnings)}
                                    </p>
                                    <p className="text-[11px] text-gray-400">Total Vendor Earnings (65%)</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                                <div className="inline-flex p-2 rounded-lg bg-gray-100">
                                    <CreditCard className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {summary.totalPayoutRequests}
                                    </p>
                                    <p className="text-[11px] text-gray-400">Total Payout Requests</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Filter */}
            <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none"
                >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.filter(Boolean).map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Payout Requests Table */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Spinner size="lg" />
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <CreditCard className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No payout requests found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {statusFilter
                            ? "Try changing the status filter"
                            : "Vendor payout requests will appear here"}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Request ID
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Vendor
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Method
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Requested
                                    </th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono text-xs text-primary-600 font-medium">
                                            #{req.id.slice(0, 8)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {req.vendor?.email || "—"}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-900">
                                            {formatPrice(req.amount)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">
                                            {METHOD_LABELS[req.paymentMethod] || req.paymentMethod}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge variant={STATUS_COLORS[req.status] || "default"}>
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">
                                            {formatDate(req.requestedAt || req.createdAt)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {req.status === "PENDING" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading === req.id}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleReject(req.id)}
                                                            disabled={actionLoading === req.id}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {req.status === "APPROVED" && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => handleProcess(req.id)}
                                                        disabled={actionLoading === req.id}
                                                    >
                                                        Process
                                                    </Button>
                                                )}
                                                {req.status === "FAILED" && req.failureReason && (
                                                    <span
                                                        className="text-xs text-red-500 max-w-[160px] truncate"
                                                        title={req.failureReason}
                                                    >
                                                        {req.failureReason}
                                                    </span>
                                                )}
                                                {(req.status === "COMPLETED" ||
                                                    req.status === "PROCESSING" ||
                                                    req.status === "REJECTED" ||
                                                    req.status === "CANCELLED") && (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm">
                            <span className="text-gray-500">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
