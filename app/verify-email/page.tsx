"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Store } from "lucide-react";

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <div style={{ background: "#ffffff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail style={{ height: 36, width: 36, color: "#2563eb" }} />
            </div>
            <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Check your inbox</h2>
                <p style={{ color: "#6b7280", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    We&apos;ve sent a verification link to{" "}
                    {email ? <strong style={{ color: "#111827" }}>{email}</strong> : "your email address"}.
                    <br />Click the link to activate your account.
                </p>
            </div>
            <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                    Already verified?{" "}
                    <Link href="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailIndexPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
            <div style={{ width: "100%", maxWidth: 448 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 32 }}>
                    <div style={{ height: 40, width: 40, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Store style={{ height: 24, width: 24, color: "#fff" }} />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Buy<span style={{ color: "#2563eb" }}>Bizz</span></span>
                </div>
                <Suspense fallback={<div style={{ textAlign: "center", padding: 32 }}>Loading...</div>}>
                    <CheckEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
