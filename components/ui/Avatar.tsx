import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
    src?: string | null;
    name?: string | null;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name || "Avatar"}
                className={cn(
                    "rounded-full object-cover border border-gray-200",
                    sizes[size],
                    className
                )}
            />
        );
    }

    if (name) {
        return (
            <div
                className={cn(
                    "rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold border border-primary-200",
                    sizes[size],
                    className
                )}
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border border-gray-200",
                sizes[size],
                className
            )}
        >
            <User className="h-1/2 w-1/2" />
        </div>
    );
}
