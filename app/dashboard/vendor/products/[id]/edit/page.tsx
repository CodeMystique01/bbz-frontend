"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Globe, Download, Key } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { Button, Spinner, ImageUpload, FileUpload } from "@/components/ui";
import { toast } from "sonner";

const CATEGORIES = [
    "Software", "Templates", "Graphics", "Audio", "Video",
    "E-books", "Courses", "Plugins", "Fonts", "Other",
];

type DeliveryType = "EXTERNAL_URL" | "DOWNLOAD" | "LICENSE_ONLY";

const DELIVERY_OPTIONS: { value: DeliveryType; label: string; description: string; icon: React.ReactNode }[] = [
    { value: "EXTERNAL_URL", label: "External URL", description: "SaaS tool, AI agent, or hosted app", icon: <Globe className="h-4 w-4" /> },
    { value: "DOWNLOAD", label: "Downloadable File", description: "Source code, templates, or assets", icon: <Download className="h-4 w-4" /> },
    { value: "LICENSE_ONLY", label: "License Key Only", description: "API key or activation code", icon: <Key className="h-4 w-4" /> },
];

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryType, setDeliveryType] = useState<DeliveryType>("LICENSE_ONLY");
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        fileUrl: "",
        category: "",
        accessUrl: "",
        deliveryInstructions: "",
    });

    useEffect(() => {
        if (!productId) return;
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function loadProduct() {
        try {
            const data = await apiClient.get<Product>(`/api/products/vendor/my-products/${productId}`);
            setDeliveryType((data.deliveryType as DeliveryType) || "LICENSE_ONLY");
            setForm({
                name: data.name,
                description: data.description,
                price: String(data.price),
                imageUrl: data.imageUrl || "",
                fileUrl: data.fileUrl || "",
                category: data.category || "",
                accessUrl: data.accessUrl || "",
                deliveryInstructions: data.deliveryInstructions || "",
            });
        } catch { toast.error("Failed to load product"); } finally { setIsLoading(false); }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.description || !form.price) { toast.error("Fill required fields"); return; }
        if (deliveryType === "EXTERNAL_URL" && !form.accessUrl) { toast.error("Access URL is required"); return; }
        if (deliveryType === "DOWNLOAD" && !form.fileUrl) { toast.error("Product file is required"); return; }

        setIsSubmitting(true);
        try {
            await apiClient.patch(`/api/products/${productId}`, {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                imageUrl: form.imageUrl || undefined,
                fileUrl: deliveryType === "DOWNLOAD" ? form.fileUrl || undefined : null,
                category: form.category || undefined,
                deliveryType,
                accessUrl: deliveryType === "EXTERNAL_URL" ? form.accessUrl || undefined : null,
                deliveryInstructions: form.deliveryInstructions || undefined,
            });
            toast.success("Product updated!");
            router.push("/dashboard/vendor/products");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to update product");
        } finally { setIsSubmitting(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500 mt-1">Update your product details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Delivery Type */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <label className="block text-xs font-medium text-gray-500 mb-3">How will buyers access this product?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {DELIVERY_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setDeliveryType(opt.value)}
                                className="cursor-pointer text-left rounded-lg border-2 p-3.5 transition-all"
                                style={{
                                    borderColor: deliveryType === opt.value ? "#6366f1" : "#e5e7eb",
                                    background: deliveryType === opt.value ? "#eef2ff" : "#fff",
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span style={{ color: deliveryType === opt.value ? "#6366f1" : "#9ca3af" }}>{opt.icon}</span>
                                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                                </div>
                                <p className="text-xs text-gray-400">{opt.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                            <input type="number" name="price" value={form.price} onChange={handleChange} min="1" step="0.01"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select name="category" value={form.category} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white">
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Files & Delivery */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                    <ImageUpload
                        label="Product Image"
                        value={form.imageUrl}
                        onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                    />

                    {deliveryType === "EXTERNAL_URL" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Access URL *</label>
                            <input type="url" name="accessUrl" value={form.accessUrl} onChange={handleChange}
                                placeholder="https://your-saas-tool.com/access"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" required />
                        </div>
                    )}

                    {deliveryType === "DOWNLOAD" && (
                        <FileUpload
                            label="Product File"
                            value={form.fileUrl}
                            onChange={(url) => setForm((prev) => ({ ...prev, fileUrl: url }))}
                        />
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Delivery Instructions <span className="text-gray-300">(optional)</span>
                        </label>
                        <textarea name="deliveryInstructions" value={form.deliveryInstructions} onChange={handleChange} rows={3}
                            placeholder="How to activate, access, or use the product after purchase..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Spinner size="sm" className="mr-2" /> Saving...</> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
