"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui";
import { ImageUpload } from "@/components/ui";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { toast } from "sonner";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function NewBlogPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManual, setSlugManual] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [tags, setTags] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [showSeo, setShowSeo] = useState(false);

    function handleTitleChange(val: string) {
        setTitle(val);
        if (!slugManual) setSlug(slugify(val));
    }

    async function handleSave(status: "DRAFT" | "PUBLISHED") {
        if (!title.trim()) { toast.error("Title is required"); return; }
        if (!content.trim() || content === "<p></p>") { toast.error("Content is required"); return; }

        setSaving(true);
        try {
            await apiClient.post("/api/admin/blog", {
                title: title.trim(),
                content,
                slug: slug || undefined,
                excerpt: excerpt || undefined,
                featuredImage: featuredImage || undefined,
                tags: tags || undefined,
                metaTitle: metaTitle || undefined,
                metaDescription: metaDescription || undefined,
                status,
            });
            toast.success(status === "PUBLISHED" ? "Post published!" : "Draft saved!");
            router.push("/admin/blog");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    }

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
                        <h1 className="text-xl font-semibold text-gray-900">New Blog Post</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Create a new post for your blog</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Save style={{ width: 14, height: 14 }} />} onClick={() => handleSave("DRAFT")} isLoading={saving}>
                        Save Draft
                    </Button>
                    <Button size="sm" leftIcon={<Send style={{ width: 14, height: 14 }} />} onClick={() => handleSave("PUBLISHED")} isLoading={saving}>
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter blog title" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Slug</label>
                        <input type="text" value={slug}
                            onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                            placeholder="auto-generated-from-title" style={{ ...inputStyle, fontSize: 13, color: "#6b7280" }} />
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
