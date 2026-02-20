import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

/* ── Card ─────────────────────────────────────────────────── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
    hover = false,
    padding = "md",
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-gray-200",
                hover && "hover:shadow-md transition-shadow",
                padding === "sm" && "p-4",
                padding === "md" && "p-6",
                padding === "lg" && "p-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

/* ── Card Header ──────────────────────────────────────────── */

export function CardHeader({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mb-4", className)} {...props}>
            {children}
        </div>
    );
}

/* ── Card Title ───────────────────────────────────────────── */

export function CardTitle({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn("text-lg font-semibold text-gray-900", className)}
            {...props}
        >
            {children}
        </h3>
    );
}

/* ── Card Description ─────────────────────────────────────── */

export function CardDescription({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-sm text-gray-500 mt-1", className)} {...props}>
            {children}
        </p>
    );
}

/* ── Card Content ─────────────────────────────────────────── */

export function CardContent({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn(className)} {...props}>
            {children}
        </div>
    );
}
