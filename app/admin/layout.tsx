"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminSidebar } from "@/components/layout/Sidebars";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardLayout sidebar={<AdminSidebar />}>{children}</DashboardLayout>;
}
