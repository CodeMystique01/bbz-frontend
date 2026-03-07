"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";
import { Button, Spinner, ImageUpload, FileUpload } from "@/components/ui";
import { toast } from "sonner";

const CATEGORIES = [
    "Software", "Templates", "Graphics", "Audio", "Video",
    "E-books", "Courses", "Plugins", "Fonts", "Other",
];

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        fileUrl: "",
        category: "",
    });

    useEffect(() => {
        if (!productId) return;
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    async function loadProduct() {
        try {
            const data = await apiClient.get<Product>(`/api/products/${productId}`);
            setForm({
                name: data.name,
                description: data.description,
                price: String(data.price),
                imageUrl: data.imageUrl || "",
                fileUrl: data.fileUrl || "",
                category: data.category || "",
            });
        } catch { toast.error("Failed to load product"); } finally { setIsLoading(false); }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.description || !form.price) { toast.error("Fill required fields"); return; }
        setIsSubmitting(true);
        try {
            await apiClient.patch(`/api/products/${productId}`, {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                imageUrl: form.imageUrl || undefined,
                fileUrl: form.fileUrl || undefined,
                category: form.category || undefined,
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
        <div className="space-y-6 animate-fade-in" style={{ maxWidth: 672 }}>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500 mt-1">Update your product details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <ImageUpload
                        label="Product Image"
                        value={form.imageUrl}
                        onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                    />
                    <FileUpload
                        label="Product File"
                        value={form.fileUrl}
                        onChange={(url) => setForm((prev) => ({ ...prev, fileUrl: url }))}
                    />
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
