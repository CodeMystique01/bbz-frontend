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

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const res = await apiClient.post<{ access_token: string; user: AuthUser }>("/api/auth/login", data);
            login(res.access_token, res.user);
            toast.success("Welcome back!");
            if (res.user.role === "ADMIN") router.push("/admin");
            else if (res.user.role === "VENDOR") router.push("/dashboard/vendor");
            else router.push("/dashboard/buyer");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left — Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Store className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-white">BuyBizz</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">Your digital marketplace awaits</h1>
                    <p className="text-lg text-primary-200 max-w-md">Buy and sell digital products with confidence. Join thousands of creators and buyers on BuyBizz.</p>
                </div>
            </div>

            {/* Right — Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center"><Store className="h-6 w-6 text-white" /></div>
                        <span className="text-2xl font-bold text-gray-900">Buy<span className="text-primary-600">Bizz</span></span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                        <p className="text-gray-500 mt-2">Log in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message}
                            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} />

                        <div>
                            <Input label="Password" type={showPassword ? "text" : "password"} placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} error={errors.password?.message}
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
                            <div className="flex justify-between items-center mt-2">
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer">
                                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>Log in</Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
