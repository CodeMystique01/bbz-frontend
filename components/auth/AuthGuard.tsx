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
    const { isAuthenticated, user, _hasHydrated } = useAuthStore();
    const [checked, setChecked] = useState(false);

    // Safety: if hydration hasn't completed after 3s, force it so we don't spin forever
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!useAuthStore.getState()._hasHydrated) {
                useAuthStore.setState({ _hasHydrated: true });
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!isAuthenticated || !user) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

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
    }, [_hasHydrated, isAuthenticated, user, requiredRole, router, pathname]);

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
