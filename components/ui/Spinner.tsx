import { Loader2, Inbox } from "lucide-react";
import type { ElementType, ReactNode } from "react";

/* ── Spinner ──────────────────────────────────────────────── */

const SIZES = { sm: 16, md: 24, lg: 32 };

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg"; className?: string }) {
    return (
        <Loader2 style={{
            height: SIZES[size],
            width: SIZES[size],
            color: "#2563eb",
            animation: "spin 1s linear infinite",
            flexShrink: 0,
        }} />
    );
}

/* ── PageLoader ───────────────────────────────────────────── */

export function PageLoader() {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            <Spinner size="lg" />
        </div>
    );
}

/* ── EmptyState ───────────────────────────────────────────── */

export function EmptyState({
    title = "Nothing here",
    description = "No data to display.",
    icon: Icon = Inbox,
    children,
}: {
    title?: string;
    description?: string;
    icon?: ElementType;
    children?: ReactNode;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
            <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#f4f4f5", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 16
            }}>
                <Icon style={{ height: 28, width: 28, color: "#a1a1aa" }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{title}</h3>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0, maxWidth: 360 }}>{description}</p>
            {children && <div style={{ marginTop: 16 }}>{children}</div>}
        </div>
    );
}
