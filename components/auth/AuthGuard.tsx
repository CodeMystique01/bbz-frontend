"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: "BUYER" | "VENDOR" | "ADMIN";
}

const roleDashboard: Record<string, string> = {
    ADMIN: "/admin",
    VENDOR: "/dashboard/vendor",
    BUYER: "/dashboard/buyer",
};

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Not logged in → send to login
        if (!isAuthenticated || !user) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        // Logged in but wrong role → send to their dashboard
        if (requiredRole) {
            const hasAccess =
                requiredRole === "VENDOR"
                    ? user.isVendor === true
                    : user.role === requiredRole;
            if (!hasAccess) {
                const fallback = user.role === "ADMIN"
                    ? "/admin"
                    : user.isVendor
                        ? "/dashboard/vendor"
                        : "/dashboard/buyer";
                router.replace(fallback);
                return;
            }
        }

        setChecked(true);
    }, [isAuthenticated, user, requiredRole, router, pathname]);

    if (!checked) {
        return (
            <div
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        border: "3px solid #e5e7eb",
                        borderTopColor: "#2563eb",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <>{children}</>;
}
