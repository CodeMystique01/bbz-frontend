"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VendorSidebar } from "@/components/layout/Sidebars";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard requiredRole="VENDOR">
            <DashboardLayout sidebar={<VendorSidebar />}>{children}</DashboardLayout>
        </AuthGuard>
    );
}
