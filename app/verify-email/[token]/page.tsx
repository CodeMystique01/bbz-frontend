"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/ui";
import { apiClient } from "@/lib/api-client";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    // Support both /verify-email/[token] and /verify-email?token=...
    const token = (params?.token as string) || searchParams.get("token");
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function verify() {
            if (!token) {
                setStatus("error");
                setMessage("No verification token found. Please use the link from your email.");
                return;
            }
            try {
                const res = await apiClient.get<{ message: string }>(`/api/auth/verify-email?token=${token}`);
                setStatus("success");
                setMessage(res.message || "Email verified successfully!");
            } catch (err: unknown) {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Verification failed");
            }
        }
        verify();
    }, [token]);

    return (
        <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", padding: 32 }}>
            {status === "loading" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <Loader2 style={{ height: 48, width: 48, color: "#2563eb", animation: "spin 1s linear infinite" }} />
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Verifying your email...</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Please wait.</p>
                </div>
            )}
            {status === "success" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 style={{ height: 32, width: 32, color: "#16a34a" }} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Email verified!</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{message}</p>
                    <Link href="/login" style={{ marginTop: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 24px", background: "#2563eb", color: "#fff", fontWeight: 500, borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
                        Continue to login
                    </Link>
                </div>
            )}
            {status === "error" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <XCircle style={{ height: 32, width: 32, color: "#dc2626" }} />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Verification failed</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>{message}</p>
                    <Link href="/login" style={{ marginTop: 4, fontSize: 14, color: "#2563eb", fontWeight: 500 }}>Back to login</Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
            <div style={{ width: "100%", maxWidth: 448, textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                    <BrandLogo size={56} />
                </div>
                <Suspense fallback={
                    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                        <Loader2 style={{ height: 48, width: 48, color: "#2563eb" }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Verifying your email...</h2>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
