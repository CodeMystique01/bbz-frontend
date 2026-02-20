"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button, Spinner } from "@/components/ui";
import { toast } from "sonner";

const CATEGORIES = [
    "Software", "Templates", "Graphics", "Audio", "Video",
    "E-books", "Courses", "Plugins", "Fonts", "Other",
];

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        fileUrl: "",
        category: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.description || !form.price || !form.imageUrl) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post("/api/products", {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                imageUrl: form.imageUrl,
                fileUrl: form.fileUrl || undefined,
                category: form.category || undefined,
            });
            toast.success("Product created! It will be reviewed by admin.");
            router.push("/dashboard/vendor/products");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500 mt-1">Create a digital product listing for your store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Premium React Dashboard Template"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe your product, features, and what buyers will get..."
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 resize-none"
                            required
                        />
                    </div>

                    {/* Price + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="499"
                                min="1"
                                step="0.01"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL *</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/product-image.jpg"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">Provide a URL to your product&apos;s cover image</p>
                    </div>

                    {/* File URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Download File URL</label>
                        <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-gray-400" />
                            <input
                                type="url"
                                name="fileUrl"
                                value={form.fileUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/product-file.zip"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">The file buyers will receive after purchase (optional)</p>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Spinner size="sm" className="mr-2" /> Creating...</> : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
