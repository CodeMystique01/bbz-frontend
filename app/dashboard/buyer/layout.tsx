"use client";

import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BuyerSidebar } from "@/components/layout/Sidebars";

export default function BuyerDashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardLayout sidebar={<BuyerSidebar />}>{children}</DashboardLayout>;
}
