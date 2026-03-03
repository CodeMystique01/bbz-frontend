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
                <div style={{ position: "relative" }}>
                    {leftIcon && (
                        <span
                            style={{
                                position: "absolute",
                                left: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                                pointerEvents: "none",
                            }}
                        >
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        style={{
                            width: "100%",
                            height: 40,
                            paddingLeft: leftIcon ? 40 : 12,
                            paddingRight: 12,
                            borderRadius: 8,
                            border: error ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                            fontSize: 14,
                            color: "#111827",
                            outline: "none",
                            transition: "border-color 0.15s",
                            boxSizing: "border-box",
                        }}
                        className={className}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = error ? "#ef4444" : "#2563eb";
                            e.currentTarget.style.boxShadow = error
                                ? "0 0 0 3px rgba(239,68,68,0.1)"
                                : "0 0 0 3px rgba(37,99,235,0.1)";
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = error ? "#fca5a5" : "#e5e7eb";
                            e.currentTarget.style.boxShadow = "none";
                            props.onBlur?.(e);
                        }}
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
