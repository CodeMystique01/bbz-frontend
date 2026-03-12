"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Globe, Download, Key } from "lucide-react";
import { Button, Input, ImageUpload, FileUpload } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";

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

interface ProductForm {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    fileUrl: string;
    category: string;
    accessUrl: string;
    deliveryInstructions: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deliveryType, setDeliveryType] = useState<DeliveryType>("LICENSE_ONLY");
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductForm>();
    const imageUrl = watch("imageUrl", "");
    const fileUrl = watch("fileUrl", "");

    const onSubmit = async (data: ProductForm) => {
        if (deliveryType === "EXTERNAL_URL" && !data.accessUrl) {
            toast.error("Access URL is required for external URL products");
            return;
        }
        if (deliveryType === "DOWNLOAD" && !data.fileUrl) {
            toast.error("Product file is required for downloadable products");
            return;
        }

        setLoading(true);
        try {
            await apiClient.post<Product>("/api/products", {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                imageUrl: data.imageUrl || undefined,
                fileUrl: deliveryType === "DOWNLOAD" ? data.fileUrl || undefined : undefined,
                category: data.category || undefined,
                deliveryType,
                accessUrl: deliveryType === "EXTERNAL_URL" ? data.accessUrl || undefined : undefined,
                deliveryInstructions: data.deliveryInstructions || undefined,
            });
            toast.success("Product submitted for review!");
            router.push("/dashboard/vendor/products");
        } catch (e: unknown) {
            const err = e as { message?: string };
            toast.error(err.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-6 cursor-pointer">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
            </button>

            <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Add New Product</h1>
                <p className="text-xs text-gray-400 mb-6">Your product will be reviewed before it appears in the marketplace.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <Input label="Product Name" placeholder="Enter product name" error={errors.name?.message}
                            {...register("name", { required: "Name is required" })} />

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
                            <textarea
                                placeholder="Describe your product..."
                                rows={4}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 resize-none"
                                {...register("description", { required: "Description is required" })}
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Price (₹)" type="number" placeholder="999" error={errors.price?.message}
                                {...register("price", { required: "Price is required", min: { value: 1, message: "Must be at least ₹1" } })} />

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                                <select
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
                                    {...register("category")}
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Delivery-specific fields */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                        <ImageUpload
                            label="Product Image"
                            value={imageUrl}
                            onChange={(url) => setValue("imageUrl", url)}
                            error={errors.imageUrl?.message}
                        />

                        {deliveryType === "EXTERNAL_URL" && (
                            <Input
                                label="Access URL"
                                placeholder="https://your-saas-tool.com/access"
                                error={errors.accessUrl?.message}
                                {...register("accessUrl", { required: deliveryType === "EXTERNAL_URL" ? "Access URL is required" : false })}
                            />
                        )}

                        {deliveryType === "DOWNLOAD" && (
                            <FileUpload
                                label="Product File"
                                value={fileUrl}
                                onChange={(url) => setValue("fileUrl", url)}
                                error={errors.fileUrl?.message}
                            />
                        )}

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Delivery Instructions <span className="text-gray-300">(optional)</span>
                            </label>
                            <textarea
                                placeholder="How to activate, access, or use the product after purchase..."
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 resize-none"
                                {...register("deliveryInstructions")}
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700">
                        Products require admin approval before they are visible in the marketplace.
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Submit Product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
