"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BlogPost } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { PageContainer } from "@/components/layout";

export default function BlogDetailPage() {
    const router = useRouter();
    const params = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await apiClient.get<BlogPost>(`/api/blog/${params.slug}`);
                setPost(data);
            } catch {
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [params.slug]);

    if (isLoading) {
        return (
            <PageContainer>
                <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}><Spinner size="lg" /></div>
            </PageContainer>
        );
    }

    if (notFound || !post) {
        return (
            <PageContainer>
                <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "100px 0" }}>
                    <h1 style={{ fontSize: 24, fontWeight: 600, color: "#111827", marginBottom: 8 }}>Post Not Found</h1>
                    <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link href="/blog" style={{ fontSize: 14, fontWeight: 500, color: "#2563eb", textDecoration: "none" }}>
                        Back to Blog
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

    return (
        <PageContainer>
            <article style={{ maxWidth: 760, margin: "0 auto", padding: "40px 0" }}>
                <button onClick={() => router.push("/blog")}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500,
                        color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 24,
                    }}>
                    <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Blog
                </button>

                {tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                        {tags.map((tag) => (
                            <span key={tag} style={{
                                fontSize: 11, fontWeight: 500, color: "#6366f1", background: "#eef2ff",
                                padding: "3px 10px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 4,
                            }}>
                                <Tag style={{ width: 10, height: 10 }} />{tag}
                            </span>
                        ))}
                    </div>
                )}

                <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginBottom: 16 }}>
                    {post.title}
                </h1>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginBottom: 32, fontSize: 13, color: "#9ca3af" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <User style={{ width: 14, height: 14 }} />
                        {post.author?.name || post.author?.email || "Admin"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar style={{ width: 14, height: 14 }} />
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Eye style={{ width: 14, height: 14 }} />
                        {post.views} views
                    </span>
                </div>

                {post.featuredImage && (
                    <div style={{ marginBottom: 32, borderRadius: 12, overflow: "hidden" }}>
                        <Image src={post.featuredImage} alt={post.title}
                            width={760} height={440}
                            sizes="(max-width: 768px) 100vw, 760px"
                            style={{ width: "100%", height: "auto", maxHeight: 440, objectFit: "cover", display: "block" }}
                            priority />
                    </div>
                )}

                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <style>{`
                    .blog-content { font-size: 16px; line-height: 1.8; color: #374151; }
                    .blog-content h1 { font-size: 1.75em; font-weight: 700; margin: 1.2em 0 0.6em; color: #111827; }
                    .blog-content h2 { font-size: 1.4em; font-weight: 600; margin: 1.1em 0 0.5em; color: #111827; }
                    .blog-content h3 { font-size: 1.15em; font-weight: 600; margin: 1em 0 0.4em; color: #111827; }
                    .blog-content p { margin: 0.6em 0; }
                    .blog-content ul, .blog-content ol { padding-left: 1.5em; margin: 0.6em 0; }
                    .blog-content li { margin: 0.3em 0; }
                    .blog-content blockquote { border-left: 3px solid #2563eb; padding-left: 1em; margin: 1em 0; color: #6b7280; font-style: italic; }
                    .blog-content pre { background: #1e1e2e; color: #cdd6f4; padding: 16px 20px; border-radius: 8px; overflow-x: auto; font-size: 14px; margin: 1em 0; }
                    .blog-content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
                    .blog-content pre code { background: none; padding: 0; }
                    .blog-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
                    .blog-content a { color: #2563eb; text-decoration: underline; }
                    .blog-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
                `}</style>

                <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 48, paddingTop: 24 }}>
                    <Link href="/blog" style={{
                        display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500,
                        color: "#2563eb", textDecoration: "none",
                    }}>
                        <ArrowLeft style={{ width: 14, height: 14 }} /> Back to all posts
                    </Link>
                </div>
            </article>
        </PageContainer>
    );
}
