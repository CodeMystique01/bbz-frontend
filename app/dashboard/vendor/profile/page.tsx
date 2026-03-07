"use client";

import { useEffect, useState } from "react";
import { User, Mail, Save, Store, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function VendorProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });

    useEffect(() => { loadProfile(); }, []);

    async function loadProfile() {
        try {
            const data = await apiClient.get<{ id: string; name: string; email: string }>("/api/users/me");
            setForm({ name: data.name || "", email: data.email || "" });
        } catch { toast.error("Failed to load profile"); } finally { setIsLoading(false); }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await apiClient.patch<{ id: string; name: string; email: string; role: string; isVendor: boolean }>("/api/users/me", { name: form.name });
            setUser({ id: updated.id, name: updated.name, email: updated.email, role: updated.role as "BUYER" | "VENDOR" | "ADMIN", isVendor: updated.isVendor });
            toast.success("Profile updated!");
        } catch { toast.error("Failed to update profile"); } finally { setIsSaving(false); }
    }

    if (isLoading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
            <Loader2 style={{ height: 32, width: 32, color: "#2563eb", animation: "spin 1s linear infinite" }} />
        </div>
    );

    return (
        <div style={{ maxWidth: 640 }}>
            {/* Page header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Vendor Profile</h1>
                <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4, marginBottom: 0 }}>Manage your store and account details</p>
            </div>

            {/* Store identity card */}
            <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, padding: "28px 32px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: 16,
                        background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Store style={{ height: 30, width: 30, color: "#7c3aed" }} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 600, fontSize: 17, color: "#111827", margin: 0 }}>{form.name || "No name set"}</p>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2, marginBottom: 0 }}>{form.email}</p>
                        <span style={{
                            display: "inline-block", marginTop: 6, fontSize: 11, fontWeight: 500,
                            color: "#7c3aed", background: "#f5f3ff", borderRadius: 20,
                            padding: "2px 10px", letterSpacing: "0.02em"
                        }}>
                            Vendor
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                            Store / Display Name
                        </label>
                        <div style={{ position: "relative" }}>
                            <User style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", height: 16, width: 16, color: "#9ca3af" }} />
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Your store name"
                                style={{
                                    width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                                    borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
                                    outline: "none", boxSizing: "border-box", background: "#fff"
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 }}>
                            Email Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", height: 16, width: 16, color: "#9ca3af" }} />
                            <input
                                type="email"
                                value={form.email}
                                disabled
                                style={{
                                    width: "100%", paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                                    borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, color: "#9ca3af",
                                    background: "#f9fafb", cursor: "not-allowed", boxSizing: "border-box"
                                }}
                            />
                        </div>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6, marginBottom: 0 }}>Email address cannot be changed</p>
                    </div>

                    <div style={{ paddingTop: 4 }}>
                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "10px 20px", borderRadius: 10, border: "none",
                                background: isSaving ? "#93c5fd" : "#2563eb", color: "#fff",
                                fontSize: 14, fontWeight: 600, cursor: isSaving ? "not-allowed" : "pointer",
                                transition: "background 0.15s"
                            }}
                        >
                            {isSaving
                                ? <><Loader2 style={{ height: 16, width: 16, animation: "spin 1s linear infinite" }} /> Saving...</>
                                : <><Save style={{ height: 16, width: 16 }} /> Save Changes</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
