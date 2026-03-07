"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { UploadResult } from "@/lib/types";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    error?: string;
    category?: string;
    accept?: string;
    maxSizeMB?: number;
    disabled?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ImageUpload({
    value,
    onChange,
    label,
    error,
    category = "products",
    accept = "image/jpeg,image/png,image/webp,image/gif",
    maxSizeMB = 10,
    disabled = false,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const validate = useCallback(
        (file: File): string | null => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return `Invalid file type. Allowed: JPEG, PNG, WebP, GIF`;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                return `File too large. Maximum size is ${maxSizeMB} MB`;
            }
            return null;
        },
        [maxSizeMB],
    );

    const upload = useCallback(
        async (file: File) => {
            const validationError = validate(file);
            if (validationError) {
                setUploadError(validationError);
                return;
            }

            setUploadError(null);
            setUploading(true);
            setProgress(20);

            try {
                const formData = new FormData();
                formData.append("file", file);

                setProgress(50);

                const res = await apiClient.upload<{ data: UploadResult }>(
                    `/api/uploads/${category}`,
                    formData,
                );

                setProgress(100);
                onChange(res.data.url);
            } catch (e: unknown) {
                const err = e as { message?: string };
                setUploadError(err.message || "Upload failed");
            } finally {
                setUploading(false);
                setProgress(0);
            }
        },
        [category, onChange, validate],
    );

    const handleDragOver = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            if (!disabled && !uploading) setDragging(true);
        },
        [disabled, uploading],
    );

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
            if (disabled || uploading) return;
            const file = e.dataTransfer.files[0];
            if (file) upload(file);
        },
        [disabled, uploading, upload],
    );

    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
        },
        [upload],
    );

    const handleRemove = useCallback(() => {
        onChange("");
        setUploadError(null);
    }, [onChange]);

    const displayError = error || uploadError;

    if (value) {
        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                        {label}
                    </label>
                )}
                <div
                    style={{
                        position: "relative",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                        background: "#f9fafb",
                    }}
                >
                    <img
                        src={value}
                        alt="Product preview"
                        style={{
                            display: "block",
                            width: "100%",
                            maxHeight: 240,
                            objectFit: "contain",
                            background: "#f9fafb",
                        }}
                    />
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                border: "none",
                                background: "rgba(0,0,0,0.55)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    )}
                </div>
                {displayError && <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444" }}>{displayError}</p>}
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            {label && (
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                    {label}
                </label>
            )}
            <div
                role="button"
                tabIndex={0}
                onClick={() => !disabled && !uploading && inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!disabled && !uploading) inputRef.current?.click();
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "28px 16px",
                    borderRadius: 8,
                    border: displayError
                        ? "2px dashed #fca5a5"
                        : dragging
                            ? "2px dashed #2563eb"
                            : "2px dashed #d1d5db",
                    background: dragging ? "#eff6ff" : "#fafafa",
                    cursor: disabled || uploading ? "not-allowed" : "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                    outline: "none",
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    disabled={disabled || uploading}
                />

                {uploading ? (
                    <>
                        <Loader2 style={{ width: 28, height: 28, color: "#2563eb", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: 13, color: "#6b7280" }}>Uploading...</span>
                        <div style={{ width: "60%", height: 4, borderRadius: 2, background: "#e5e7eb", overflow: "hidden" }}>
                            <div
                                style={{
                                    height: "100%",
                                    width: `${progress}%`,
                                    background: "#2563eb",
                                    borderRadius: 2,
                                    transition: "width 0.3s ease",
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <ImagePlus style={{ width: 28, height: 28, color: "#9ca3af" }} />
                        <span style={{ fontSize: 13, color: "#6b7280" }}>
                            Click or drag image to upload
                        </span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>
                            JPEG, PNG, WebP, GIF &middot; Max {maxSizeMB} MB
                        </span>
                    </>
                )}
            </div>
            {displayError && (
                <p style={{ marginTop: 5, fontSize: 12, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertCircle style={{ width: 12, height: 12, flexShrink: 0 }} />
                    {displayError}
                </p>
            )}
        </div>
    );
}
