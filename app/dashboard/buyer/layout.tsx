"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BuyerSidebar } from "@/components/layout/Sidebars";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function BuyerDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard requiredRole="BUYER">
            <DashboardLayout sidebar={<BuyerSidebar />}>{children}</DashboardLayout>
        </AuthGuard>
    );
}
