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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Store className="h-7 w-7 text-white" /></div>
                        <span className="text-3xl font-bold text-white">BuyBizz</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">Start your journey today</h1>
                    <p className="text-lg text-primary-200 max-w-md">Whether you&apos;re buying or selling, BuyBizz gives you the tools you need to succeed.</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center"><Store className="h-6 w-6 text-white" /></div>
                        <span className="text-2xl font-bold text-gray-900">Buy<span className="text-primary-600">Bizz</span></span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                        <p className="text-gray-500 mt-2">Join BuyBizz and start exploring</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${selectedRole === "BUYER" ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                    <input type="radio" value="BUYER" className="sr-only" {...register("role")} />
                                    <User className="h-4 w-4" /> Buy Products
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${selectedRole === "VENDOR" ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                    <input type="radio" value="VENDOR" className="sr-only" {...register("role")} />
                                    <Store className="h-4 w-4" /> Sell Products
                                </label>
                            </div>
                        </div>

                        <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message}
                            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} />

                        <div>
                            <Input label="Password" type={showPassword ? "text" : "password"} placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} error={errors.password?.message}
                                {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-1.5 cursor-pointer">
                                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{showPassword ? "Hide" : "Show"} password
                            </button>
                        </div>

                        <Input label="Confirm Password" type="password" placeholder="••••••••" leftIcon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message}
                            {...register("confirmPassword", { required: "Please confirm", validate: (v) => v === password || "Passwords do not match" })} />

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>Create account</Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
