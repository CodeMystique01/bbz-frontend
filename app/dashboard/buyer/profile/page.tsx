"use client";

import { useEffect, useState } from "react";
import { User, Mail, Save } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Button, Spinner } from "@/components/ui";
import { toast } from "sonner";

export default function BuyerProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({ name: "", email: "" });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const data = await apiClient.get<{ id: string; name: string; email: string }>("/api/users/me");
            setForm({ name: data.name || "", email: data.email || "" });
        } catch { /* ignore */ } finally { setIsLoading(false); }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await apiClient.patch<{ id: string; name: string; email: string; role: string }>("/api/users/me", { name: form.name });
            setUser({ id: updated.id, name: updated.name, email: updated.email, role: updated.role as "BUYER" | "VENDOR" | "ADMIN" });
            toast.success("Profile updated!");
        } catch { toast.error("Failed to update profile"); } finally { setIsSaving(false); }
    }

    if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

    return (
        <div className="space-y-6 animate-fade-in" style={{ maxWidth: 576 }}>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account details</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                        {(form.name || form.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{form.name || "No name set"}</p>
                        <p className="text-sm text-gray-500">{form.email}</p>
                        <p className="text-xs text-primary-600 mt-0.5">{user?.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="Your full name" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="email" value={form.email} disabled
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <Button type="submit" disabled={isSaving} className="mt-2">
                        {isSaving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                    </Button>
                </form>
            </div>
        </div>
    );
}
