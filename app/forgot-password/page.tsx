"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, ArrowLeft, Store } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

    const onSubmit = async (data: { email: string }) => {
        setLoading(true);
        try {
            await apiClient.post("/api/auth/forgot-password", data);
            setSent(true);
            toast.success("Password reset email sent!");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
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

                {sent ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4"><Mail className="h-8 w-8 text-primary-600" /></div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-500 text-sm mb-6">We&apos;ve sent a password reset link to your email address.</p>
                        <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Back to login</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Forgot your password?</h2>
                        <p className="text-gray-500 text-sm text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message}
                                {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} />
                            <Button type="submit" className="w-full" size="lg" isLoading={loading}>Send reset link</Button>
                        </form>
                        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-6">
                            <ArrowLeft className="h-4 w-4" /> Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
