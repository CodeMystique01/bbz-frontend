"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Store } from "lucide-react";
import { apiClient } from "@/lib/api-client";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
    const params = useParams();
    const token = params.token as string;
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function verify() {
            try {
                const res = await apiClient.post<{ message: string }>("/api/auth/verify-email", { token });
                setStatus("success");
                setMessage(res.message || "Email verified successfully!");
            } catch (err: unknown) {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Verification failed");
            }
        }
        if (token) verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center"><Store className="h-6 w-6 text-white" /></div>
                    <span className="text-2xl font-bold text-gray-900">Buy<span className="text-primary-600">Bizz</span></span>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
                            <h2 className="text-xl font-bold text-gray-900">Verifying your email...</h2>
                            <p className="text-gray-500 text-sm">Please wait.</p>
                        </div>
                    )}
                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
                            <h2 className="text-xl font-bold text-gray-900">Email verified!</h2>
                            <p className="text-gray-500 text-sm">{message}</p>
                            <Link href="/login" className="mt-2 inline-flex items-center justify-center h-10 px-6 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-sm">Continue to login</Link>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"><XCircle className="h-8 w-8 text-red-600" /></div>
                            <h2 className="text-xl font-bold text-gray-900">Verification failed</h2>
                            <p className="text-gray-500 text-sm">{message}</p>
                            <Link href="/login" className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">Back to login</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
