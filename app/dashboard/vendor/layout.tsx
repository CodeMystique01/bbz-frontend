"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VendorSidebar } from "@/components/layout/Sidebars";

export default function VendorDashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardLayout sidebar={<VendorSidebar />}>{children}</DashboardLayout>;
}
