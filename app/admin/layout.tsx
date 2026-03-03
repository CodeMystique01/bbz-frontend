"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminSidebar } from "@/components/layout/Sidebars";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard requiredRole="ADMIN">
            <DashboardLayout sidebar={<AdminSidebar />}>{children}</DashboardLayout>
        </AuthGuard>
    );
}
