"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const BASE: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    transition: "background 0.15s, opacity 0.15s",
    fontFamily: "inherit",
};

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: "#2563eb", color: "#fff" },
    secondary: { background: "#f4f4f5", color: "#3f3f46" },
    outline: { background: "transparent", color: "#3f3f46", border: "1px solid #d4d4d8" },
    ghost: { background: "transparent", color: "#52525b" },
    danger: { background: "#dc2626", color: "#fff" },
};

const HOVER: Record<ButtonVariant, string> = {
    primary: "#1d4ed8",
    secondary: "#e4e4e7",
    outline: "#fafafa",
    ghost: "#f4f4f5",
    danger: "#b91c1c",
};

const SIZES: Record<ButtonSize, React.CSSProperties> = {
    sm: { height: 32, padding: "0 12px", fontSize: 12, gap: 6, borderRadius: 6 },
    md: { height: 40, padding: "0 16px", fontSize: 14, gap: 8, borderRadius: 8 },
    lg: { height: 48, padding: "0 24px", fontSize: 15, gap: 8, borderRadius: 10 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, style, disabled, children, ...props }, ref) => {
        const [hovered, setHovered] = useState(false);

        const variantStyle = VARIANTS[variant];
        const hoverBg = HOVER[variant];

        const computedStyle: React.CSSProperties = {
            ...BASE,
            ...variantStyle,
            ...SIZES[size],
            opacity: disabled || isLoading ? 0.5 : 1,
            cursor: disabled || isLoading ? "not-allowed" : "pointer",
            ...(hovered && !disabled && !isLoading && variant !== "outline" && variant !== "ghost"
                ? { background: hoverBg }
                : hovered && !disabled && !isLoading
                    ? { background: hoverBg }
                    : {}),
            ...style,
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                style={computedStyle}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                {...props}
            >
                {isLoading
                    ? <Loader2 style={{ height: 16, width: 16, animation: "spin 1s linear infinite" }} />
                    : leftIcon
                }
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);
Button.displayName = "Button";
