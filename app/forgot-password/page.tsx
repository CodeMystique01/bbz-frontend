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
        <div
            style={{
                minHeight: "100vh",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
            }}
        >
            <div style={{ width: "100%", maxWidth: 400 }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 40 }}>
                    <div
                        style={{
                            height: 36,
                            width: 36,
                            borderRadius: 10,
                            background: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Store style={{ height: 20, width: 20, color: "#fff" }} />
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>
                        Buy<span style={{ color: "#2563eb" }}>Bizz</span>
                    </span>
                </div>

                {sent ? (
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "#eff6ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                            }}
                        >
                            <Mail style={{ height: 24, width: 24, color: "#2563eb" }} />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>Check your email</h2>
                        <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 24px" }}>
                            We&apos;ve sent a password reset link to your email.
                        </p>
                        <Link href="/login" style={{ fontSize: 13, color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>Forgot your password?</h2>
                            <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6 }}>
                                Enter your email and we&apos;ll send a reset link.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                leftIcon={<Mail style={{ height: 16, width: 16 }} />}
                                error={errors.email?.message}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                                })}
                            />

                            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                                Send reset link
                            </Button>
                        </form>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28 }}>
                            <ArrowLeft style={{ height: 14, width: 14, color: "#9ca3af" }} />
                            <Link href="/login" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>
                                Back to login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
