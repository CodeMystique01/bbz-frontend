"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Store } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { apiClient } from "@/lib/api-client";

interface SignupForm {
    email: string;
    password: string;
    confirmPassword: string;
    role: "BUYER" | "VENDOR";
}

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({ defaultValues: { role: "BUYER" } });
    const selectedRole = watch("role");
    const password = watch("password");

    const onSubmit = async (data: SignupForm) => {
        setLoading(true);
        try {
            await apiClient.post("/api/auth/signup", { email: data.email, password: data.password, role: data.role });
            toast.success("Account created! Check your email to verify.");
            router.push("/login");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const roleButtonStyle = (active: boolean): React.CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 0",
        borderRadius: 8,
        border: active ? "1px solid #93c5fd" : "1px solid #e5e7eb",
        background: active ? "#eff6ff" : "transparent",
        color: active ? "#1d4ed8" : "#6b7280",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        transition: "all .15s",
    });

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
                    <h2 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: 0 }}>Create your account</h2>
                    <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6 }}>Join BuyBizz and start exploring</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Role picker */}
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 8 }}>
                            I want to
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <label style={roleButtonStyle(selectedRole === "BUYER")}>
                                <input type="radio" value="BUYER" style={{ display: "none" }} {...register("role")} />
                                <User style={{ height: 14, width: 14 }} /> Buy Products
                            </label>
                            <label style={roleButtonStyle(selectedRole === "VENDOR")}>
                                <input type="radio" value="VENDOR" style={{ display: "none" }} {...register("role")} />
                                <Store style={{ height: 14, width: 14 }} /> Sell Products
                            </label>
                        </div>
                    </div>

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
                                marginTop: 4,
                            }}
                        >
                            {showPassword ? <EyeOff style={{ height: 12, width: 12 }} /> : <Eye style={{ height: 12, width: 12 }} />}
                            {showPassword ? "Hide" : "Show"} password
                        </button>
                    </div>

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock style={{ height: 16, width: 16 }} />}
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                            required: "Please confirm",
                            validate: (v) => v === password || "Passwords do not match",
                        })}
                    />

                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Create account
                    </Button>
                </form>

                <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 28 }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
