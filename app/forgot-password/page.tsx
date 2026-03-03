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
        <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
            <div style={{ width: "100%", maxWidth: 400 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 40 }}>
                    <div style={{ height: 32, width: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Store style={{ height: 20, width: 20, color: "#fff" }} />
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>Buy<span style={{ color: "#2563eb" }}>Bizz</span></span>
                </div>

                {sent ? (
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-6 w-6 text-primary-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Check your email</h2>
                        <p className="text-sm text-gray-400 mb-6">We&apos;ve sent a password reset link to your email.</p>
                        <Link href="/login" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Back to login</Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-gray-900">Forgot your password?</h2>
                            <p className="text-sm text-gray-400 mt-1">Enter your email and we&apos;ll send a reset link.</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message}
                                {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} />
                            <Button type="submit" className="w-full" size="lg" isLoading={loading}>Send reset link</Button>
                        </form>
                        <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mt-6">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
