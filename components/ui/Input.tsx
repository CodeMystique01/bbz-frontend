"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Input ────────────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full h-10 px-3 rounded-lg border bg-white text-sm transition-colors",
                            "placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                            leftIcon && "pl-10",
                            error
                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                : "border-gray-200 hover:border-gray-300",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                {hint && !error && (
                    <p className="mt-1 text-xs text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

/* ── Textarea ─────────────────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full px-3 py-2.5 rounded-lg border bg-white text-sm transition-colors resize-y min-h-[100px]",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                        error
                            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                            : "border-gray-200 hover:border-gray-300",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                {hint && !error && (
                    <p className="mt-1 text-xs text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
