"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Store } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import { useAuthStore, type AuthUser } from "@/store/auth-store";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [resending, setResending] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const res = await apiClient.post<{ access_token: string; user: AuthUser }>("/api/auth/login", data);
            login(res.access_token, res.user);
            toast.success("Welcome back!");
            if (res.user.role === "ADMIN") router.push("/admin");
            else if (res.user.isVendor) router.push("/dashboard/vendor");
            else router.push("/dashboard/buyer");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!resendEmail) { toast.error("Please enter your email"); return; }
        setResending(true);
        try {
            await apiClient.post("/api/auth/resend-verification", { email: resendEmail });
            toast.success("Verification email sent! Check your inbox.");
            setShowResend(false);
            setResendEmail("");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to resend");
        } finally {
            setResending(false);
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

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>Welcome back</h2>
                    <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6 }}>Log in to your account</p>
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

                    <div>
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            leftIcon={<Lock style={{ height: 16, width: 16 }} />}
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 8, message: "Min 8 characters" },
                            })}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    fontSize: 11,
                                    color: "#9ca3af",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    cursor: "pointer",
                                    border: "none",
                                    background: "transparent",
                                    padding: 0,
                                }}
                            >
                                {showPassword ? <EyeOff style={{ height: 12, width: 12 }} /> : <Eye style={{ height: 12, width: 12 }} />}
                                {showPassword ? "Hide" : "Show"}
                            </button>
                            <Link href="/forgot-password" style={{ fontSize: 11, color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Log in
                    </Button>
                </form>

                <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 28 }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                        Sign up
                    </Link>
                </p>

                {/* Resend Verification */}
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    {!showResend ? (
                        <button
                            type="button"
                            onClick={() => setShowResend(true)}
                            style={{
                                fontSize: 12, color: "#6b7280", background: "transparent",
                                border: "none", cursor: "pointer", textDecoration: "underline",
                            }}
                        >
                            Didn&apos;t receive verification email?
                        </button>
                    ) : (
                        <div style={{
                            display: "flex", gap: 8, alignItems: "center",
                            marginTop: 4, justifyContent: "center",
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                style={{
                                    flex: 1, padding: "8px 12px", borderRadius: 8,
                                    border: "1px solid #e5e7eb", fontSize: 13,
                                    outline: "none",
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                style={{
                                    padding: "8px 16px", borderRadius: 8,
                                    background: "#2563eb", color: "#fff",
                                    fontSize: 12, fontWeight: 500, border: "none",
                                    cursor: resending ? "not-allowed" : "pointer",
                                    opacity: resending ? 0.6 : 1,
                                }}
                            >
                                {resending ? "Sending..." : "Resend"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
