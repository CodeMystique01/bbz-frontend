import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
    default: { background: "#f4f4f5", color: "#3f3f46" },
    primary: { background: "#dbeafe", color: "#1e40af" },
    success: { background: "#dcfce7", color: "#15803d" },
    warning: { background: "#fef3c7", color: "#b45309" },
    error: { background: "#fee2e2", color: "#b91c1c" },
    outline: { background: "transparent", border: "1px solid #d4d4d8", color: "#52525b" },
};

const BASE: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1.8,
    whiteSpace: "nowrap",
};

export function Badge({ variant = "default", style, children, ...props }: BadgeProps) {
    return (
        <span style={{ ...BASE, ...VARIANT_STYLES[variant], ...style }} {...props}>
            {children}
        </span>
    );
}
