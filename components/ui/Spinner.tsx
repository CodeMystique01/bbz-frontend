import { cn } from "@/lib/utils";
import { Loader2, Inbox } from "lucide-react";

/* ── Spinner ──────────────────────────────────────────────── */

export function Spinner({
    size = "md",
    className,
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
    return (
        <Loader2
            className={cn("animate-spin text-primary-600", sizeMap[size], className)}
        />
    );
}

/* ── PageLoader ───────────────────────────────────────────── */

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
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
    icon?: React.ElementType;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-sm">{description}</p>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
