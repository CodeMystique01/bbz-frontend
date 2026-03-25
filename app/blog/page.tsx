"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FileText, Calendar, User, Eye, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BlogPost, BlogListResponse } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/layout";

export default function BlogListingPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [allTags, setAllTags] = useState<string[]>([]);

    const loadPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "9" });
            if (activeTag) params.set("tag", activeTag);
            const data = await apiClient.get<BlogListResponse>(`/api/blog?${params}`);
            setPosts(data.posts);
            setTotalPages(data.totalPages);

            if (!activeTag && page === 1) {
                const tags = new Set<string>();
                data.posts.forEach((p) => {
                    if (p.tags) p.tags.split(",").forEach((t) => { const trimmed = t.trim(); if (trimmed) tags.add(trimmed); });
                });
                setAllTags(Array.from(tags));
            }
        } catch { setPosts([]); } finally { setIsLoading(false); }
    }, [page, activeTag]);

    useEffect(() => { loadPosts(); }, [loadPosts]);

    function handleTagClick(tag: string) {
        setActiveTag((prev) => (prev === tag ? null : tag));
        setPage(1);
    }

    return (
        <PageContainer>
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 0" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Blog</h1>
                    <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>
                        Insights, updates, and stories from our team
                    </p>
                </div>

                {allTags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32 }}>
                        {allTags.map((tag) => (
                            <button key={tag} onClick={() => handleTagClick(tag)}
                                style={{
                                    padding: "5px 14px", fontSize: 12, fontWeight: 500, borderRadius: 20,
                                    border: activeTag === tag ? "1px solid #2563eb" : "1px solid #e5e7eb",
                                    background: activeTag === tag ? "#eff6ff" : "#fff",
                                    color: activeTag === tag ? "#2563eb" : "#6b7280",
                                    cursor: "pointer", transition: "all 0.15s",
                                }}>
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}><Spinner size="lg" /></div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <FileText style={{ width: 48, height: 48, color: "#d1d5db", margin: "0 auto 12px" }} />
                        <p style={{ fontSize: 16, fontWeight: 500, color: "#374151" }}>No posts yet</p>
                        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Check back soon for new content</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                            {posts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                                    <article style={{
                                        borderRadius: 12, border: "1px solid #f3f4f6", overflow: "hidden",
                                        background: "#fff", transition: "box-shadow 0.2s, border-color 0.2s",
                                        height: "100%", display: "flex", flexDirection: "column",
                                    }}
                                        className="hover:shadow-md hover:border-gray-200"
                                    >
                                        {post.featuredImage ? (
                                            <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#f9fafb" }}>
                                                <img src={post.featuredImage} alt={post.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                                                    className="hover:scale-105" />
                                            </div>
                                        ) : (
                                            <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <FileText style={{ width: 40, height: 40, color: "#d1d5db" }} />
                                            </div>
                                        )}
                                        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                                            {post.tags && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                                    {post.tags.split(",").slice(0, 3).map((tag) => (
                                                        <span key={tag.trim()} style={{
                                                            fontSize: 10, fontWeight: 500, color: "#6366f1", background: "#eef2ff",
                                                            padding: "2px 8px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 3,
                                                        }}>
                                                            <Tag style={{ width: 8, height: 8 }} />{tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#111827", marginBottom: 8, lineHeight: 1.4 }}>
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                                                    {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + "..." : post.excerpt}
                                                </p>
                                            )}
                                            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#9ca3af", marginTop: "auto" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <User style={{ width: 11, height: 11 }} />
                                                    {post.author?.name || post.author?.email || "Admin"}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Calendar style={{ width: 11, height: 11 }} />
                                                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Eye style={{ width: 11, height: 11 }} />
                                                    {post.views}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 40 }}>
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 4, padding: "8px 16px", fontSize: 13, fontWeight: 500,
                                        borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: page <= 1 ? "#d1d5db" : "#374151",
                                        cursor: page <= 1 ? "not-allowed" : "pointer",
                                    }}>
                                    <ChevronLeft style={{ width: 14, height: 14 }} /> Previous
                                </button>
                                <span style={{ fontSize: 13, color: "#6b7280" }}>Page {page} of {totalPages}</span>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 4, padding: "8px 16px", fontSize: 13, fontWeight: 500,
                                        borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: page >= totalPages ? "#d1d5db" : "#374151",
                                        cursor: page >= totalPages ? "not-allowed" : "pointer",
                                    }}>
                                    Next <ChevronRight style={{ width: 14, height: 14 }} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageContainer>
    );
}
