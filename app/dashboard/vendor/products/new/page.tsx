"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button, Input, ImageUpload, FileUpload } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/types";

const CATEGORIES = [
    "Software", "Templates", "Graphics", "Audio", "Video",
    "E-books", "Courses", "Plugins", "Fonts", "Other",
];

interface ProductForm {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    fileUrl: string;
    category: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductForm>();
    const imageUrl = watch("imageUrl", "");
    const fileUrl = watch("fileUrl", "");

    const onSubmit = async (data: ProductForm) => {
        setLoading(true);
        try {
            await apiClient.post<Product>("/api/products", {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                imageUrl: data.imageUrl || undefined,
                fileUrl: data.fileUrl || undefined,
                category: data.category || undefined,
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

            <div style={{ maxWidth: 576 }}>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Add New Product</h1>
                <p className="text-xs text-gray-400 mb-6">Your product will be reviewed before it appears in the marketplace.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <ImageUpload
                        label="Product Image"
                        value={imageUrl}
                        onChange={(url) => setValue("imageUrl", url)}
                        error={errors.imageUrl?.message}
                    />

                    <FileUpload
                        label="Product File"
                        value={fileUrl}
                        onChange={(url) => setValue("fileUrl", url)}
                        error={errors.fileUrl?.message}
                    />

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
