"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { BlogPost } from "@/lib/types";
import { Button, Spinner } from "@/components/ui";
import { ImageUpload } from "@/components/ui";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { toast } from "sonner";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [tags, setTags] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
    const [showSeo, setShowSeo] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const post = await apiClient.get<BlogPost>(`/api/admin/blog/${params.id}`);
                setTitle(post.title);
                setSlug(post.slug || "");
                setExcerpt(post.excerpt || "");
                setContent(post.content);
                setFeaturedImage(post.featuredImage || "");
                setTags(post.tags || "");
                setMetaTitle(post.metaTitle || "");
                setMetaDescription(post.metaDescription || "");
                setStatus(post.status);
                if (post.metaTitle || post.metaDescription) setShowSeo(true);
            } catch { toast.error("Failed to load post"); router.push("/admin/blog"); }
            finally { setLoading(false); }
        }
        load();
    }, [params.id, router]);

    async function handleSave(newStatus?: "DRAFT" | "PUBLISHED") {
        if (!title.trim()) { toast.error("Title is required"); return; }
        if (!content.trim() || content === "<p></p>") { toast.error("Content is required"); return; }

        setSaving(true);
        try {
            await apiClient.patch(`/api/admin/blog/${params.id}`, {
                title: title.trim(),
                content,
                slug: slug || undefined,
                excerpt: excerpt || undefined,
                featuredImage: featuredImage || null,
                tags: tags || null,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                status: newStatus || status,
            });
            toast.success("Post updated!");
            router.push("/admin/blog");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to update");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "8px 12px", fontSize: 14, borderRadius: 8,
        border: "1px solid #e5e7eb", outline: "none", fontFamily: "inherit", color: "#1f2937",
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/blog")} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Edit Blog Post</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Editing: {title || "Untitled"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {status === "PUBLISHED" ? (
                        <>
                            <Button variant="outline" size="sm" leftIcon={<EyeOff style={{ width: 14, height: 14 }} />} onClick={() => handleSave("DRAFT")} isLoading={saving}>
                                Unpublish
                            </Button>
                            <Button size="sm" leftIcon={<Save style={{ width: 14, height: 14 }} />} onClick={() => handleSave()} isLoading={saving}>
                                Update
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" leftIcon={<Save style={{ width: 14, height: 14 }} />} onClick={() => handleSave("DRAFT")} isLoading={saving}>
                                Save Draft
                            </Button>
                            <Button size="sm" leftIcon={<Send style={{ width: 14, height: 14 }} />} onClick={() => handleSave("PUBLISHED")} isLoading={saving}>
                                Publish
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Slug</label>
                        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-url-slug"
                            style={{ ...inputStyle, fontSize: 13, color: "#6b7280" }} />
                    </div>

                    <div>
                        <label style={labelStyle}>Content</label>
                        <BlogEditor content={content} onChange={setContent} />
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <ImageUpload value={featuredImage} onChange={setFeaturedImage} label="Featured Image" category="others" />
                    </div>

                    <div>
                        <label style={labelStyle}>Excerpt</label>
                        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the post"
                            rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>

                    <div>
                        <label style={labelStyle}>Tags</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. tech, news, updates" style={inputStyle} />
                        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Comma-separated tags</p>
                    </div>

                    <div>
                        <button type="button" onClick={() => setShowSeo(!showSeo)}
                            style={{ fontSize: 13, fontWeight: 500, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            {showSeo ? "Hide" : "Show"} SEO Settings
                        </button>
                        {showSeo && (
                            <div className="space-y-4 mt-3">
                                <div>
                                    <label style={labelStyle}>Meta Title</label>
                                    <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO title" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Meta Description</label>
                                    <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="SEO description"
                                        rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
