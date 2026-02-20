"use client";

import { useEffect, useState } from "react";
import { Users, Search, ChevronLeft, ChevronRight, Shield, Ban, UserCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { AdminUser } from "@/lib/types";
import { Spinner, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const ROLE_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    ADMIN: "error",
    VENDOR: "warning",
    BUYER: "default",
};

const STATUS_COLORS: Record<string, "success" | "warning" | "error" | "default"> = {
    ACTIVE: "success",
    SUSPENDED: "warning",
    BANNED: "error",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { loadUsers(); }, [page]);

    async function loadUsers() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "15");
            if (searchQuery) params.set("search", searchQuery);

            const res = await apiClient.get<{ users: AdminUser[]; total: number; totalPages: number } | AdminUser[]>(
                `/api/admin/users?${params.toString()}`
            );

            if (Array.isArray(res)) {
                setUsers(res);
                setTotalPages(1);
            } else {
                setUsers(res.users || []);
                setTotalPages(res.totalPages || 1);
            }
        } catch {
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStatusChange(userId: string, newStatus: string) {
        try {
            await apiClient.patch(`/api/admin/users/${userId}/status`, { status: newStatus });
            setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus as AdminUser["status"] } : u));
            toast.success(`User ${newStatus.toLowerCase()} successfully`);
        } catch {
            toast.error("Failed to update user status");
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        loadUsers();
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and access</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-l-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                </div>
                <button type="submit" className="px-4 py-2.5 bg-primary-600 text-white rounded-r-lg text-sm font-medium hover:bg-primary-700 cursor-pointer">Search</button>
            </form>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : users.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Users className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No users found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">User</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Role</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Status</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Verified</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Joined</th>
                                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name || "—"}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><Badge variant={ROLE_COLORS[user.role] || "default"}>{user.role}</Badge></td>
                                        <td className="px-5 py-4"><Badge variant={STATUS_COLORS[user.status] || "default"}>{user.status}</Badge></td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-medium ${user.emailVerified ? "text-green-600" : "text-gray-400"}`}>
                                                {user.emailVerified ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                {user.status !== "ACTIVE" && (
                                                    <button onClick={() => handleStatusChange(user.id, "ACTIVE")} title="Activate"
                                                        className="p-1.5 text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
                                                        <UserCheck className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {user.status !== "SUSPENDED" && (
                                                    <button onClick={() => handleStatusChange(user.id, "SUSPENDED")} title="Suspend"
                                                        className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer">
                                                        <Shield className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {user.status !== "BANNED" && (
                                                    <button onClick={() => handleStatusChange(user.id, "BANNED")} title="Ban"
                                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                                                        <Ban className="h-4 w-4" />
                                                    </button>
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
                            <span className="text-gray-500">Page {page} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
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
