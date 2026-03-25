"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Eye, Pencil, Trash2, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BlogPost, BlogListResponse } from "@/lib/types";
import { Spinner, Badge, Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type StatusFilter = "all" | "DRAFT" | "PUBLISHED";

export default function AdminBlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { loadPosts(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter, page]);

    async function loadPosts() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "10" });
            if (filter !== "all") params.set("status", filter);
            const data = await apiClient.get<BlogListResponse>(`/api/admin/blog?${params}`);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch { setPosts([]); } finally { setIsLoading(false); }
    }

    async function handleTogglePublish(id: string) {
        try {
            await apiClient.patch(`/api/admin/blog/${id}/publish`);
            toast.success("Status updated");
            loadPosts();
        } catch { toast.error("Failed to update status"); }
    }

    async function handleDelete() {
        if (!deleteId) return;
        try {
            await apiClient.delete(`/api/admin/blog/${deleteId}`);
            toast.success("Blog post deleted");
            setDeleteId(null);
            loadPosts();
        } catch { toast.error("Failed to delete post"); }
    }

    const STATUS_COLORS: Record<string, "success" | "warning"> = {
        PUBLISHED: "success",
        DRAFT: "warning",
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Blog Management</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Create and manage blog posts</p>
                </div>
                <Button size="sm" leftIcon={<Plus style={{ width: 14, height: 14 }} />} onClick={() => router.push("/admin/blog/new")}>
                    New Post
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-300" />
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {(["all", "DRAFT", "PUBLISHED"] as StatusFilter[]).map((f) => (
                        <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                            {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : posts.length === 0 ? (
                <div className="rounded-xl border border-gray-100 p-12 text-center">
                    <FileText className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">No blog posts found</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first post to get started</p>
                </div>
            ) : (
                <>
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-50 text-left">
                                        <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Views</th>
                                        <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    {post.featuredImage ? (
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                                                            <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                            <FileText className="w-3.5 h-3.5 text-gray-300" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900 truncate max-w-[250px] block">{post.title}</span>
                                                        {post.slug && <span className="text-[11px] text-gray-400">/{post.slug}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={STATUS_COLORS[post.status] || "default"}>{post.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(post.createdAt)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleTogglePublish(post.id)}
                                                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                                                        title={post.status === "PUBLISHED" ? "Unpublish" : "Publish"}>
                                                        {post.status === "PUBLISHED"
                                                            ? <ToggleRight className="h-3.5 w-3.5 text-green-500" />
                                                            : <ToggleLeft className="h-3.5 w-3.5" />}
                                                    </button>
                                                    <button onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors cursor-pointer" title="Edit">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => setDeleteId(post.id)}
                                                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Delete">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                            <span className="flex items-center px-3 text-xs text-gray-500">Page {page} of {totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                        </div>
                    )}
                </>
            )}

            {deleteId && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Delete Blog Post</h3>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
