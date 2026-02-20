"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Lock, Store } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { apiClient } from "@/lib/api-client";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string; confirmPassword: string }>();
    const password = watch("password");

    const onSubmit = async (data: { password: string }) => {
        setLoading(true);
        try {
            await apiClient.post("/api/auth/reset-password", { token, newPassword: data.password });
            toast.success("Password reset successfully!");
            router.push("/login");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center"><Store className="h-6 w-6 text-white" /></div>
                    <span className="text-2xl font-bold text-gray-900">Buy<span className="text-primary-600">Bizz</span></span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Set new password</h2>
                    <p className="text-gray-500 text-sm text-center mb-6">Enter your new password below.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input label="New Password" type="password" placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} error={errors.password?.message}
                            {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })} />
                        <Input label="Confirm Password" type="password" placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message}
                            {...register("confirmPassword", { required: "Please confirm", validate: (v) => v === password || "Passwords do not match" })} />
                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>Reset password</Button>
                    </form>
                    <Link href="/login" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-6">Back to login</Link>
                </div>
            </div>
        </div>
    );
}
