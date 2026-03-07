"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

/* ── Input ────────────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, id, style, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label htmlFor={inputId} style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                        {label}
                    </label>
                )}
                <div style={{ position: "relative" }}>
                    {leftIcon && (
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", display: "flex" }}>
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        style={{
                            width: "100%",
                            height: 42,
                            paddingLeft: leftIcon ? 40 : 14,
                            paddingRight: 14,
                            borderRadius: 8,
                            border: error ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                            backgroundColor: props.disabled ? "#f9fafb" : "#fff",
                            fontSize: 14,
                            color: props.disabled ? "#9ca3af" : "#111827",
                            outline: "none",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            cursor: props.disabled ? "not-allowed" : "text",
                            ...style,
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = error ? "#ef4444" : "#2563eb";
                            e.currentTarget.style.boxShadow = error ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(37,99,235,0.1)";
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
                {error && <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444" }}>{error}</p>}
                {hint && !error && <p style={{ marginTop: 5, fontSize: 12, color: "#9ca3af" }}>{hint}</p>}
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
    ({ label, error, hint, id, style, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label htmlFor={inputId} style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: error ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                        background: "#fff",
                        fontSize: 14,
                        color: "#111827",
                        outline: "none",
                        resize: "vertical",
                        minHeight: 100,
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        ...style,
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = error ? "#ef4444" : "#2563eb";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "#fca5a5" : "#e5e7eb";
                        e.currentTarget.style.boxShadow = "none";
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
                {error && <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444" }}>{error}</p>}
                {hint && !error && <p style={{ marginTop: 5, fontSize: 12, color: "#9ca3af" }}>{hint}</p>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
