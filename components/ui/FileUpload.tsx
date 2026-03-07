"use client";

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileUp, X, Loader2, AlertCircle, FileArchive } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { UploadResult } from "@/lib/types";

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    error?: string;
    category?: string;
    accept?: string;
    maxSizeMB?: number;
    allowedTypes?: string[];
    disabled?: boolean;
}

const DEFAULT_ALLOWED_TYPES = [
    "application/zip",
    "application/x-zip-compressed",
    "application/pdf",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
];

const FRIENDLY_TYPES = "ZIP, PDF, RAR, 7Z";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
    value,
    onChange,
    label,
    error,
    category = "products",
    accept = ".zip,.pdf,.rar,.7z",
    maxSizeMB = 50,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    disabled = false,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);

    const validate = useCallback(
        (file: File): string | null => {
            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                return `Invalid file type. Allowed: ${FRIENDLY_TYPES}`;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                return `File too large. Maximum size is ${maxSizeMB} MB`;
            }
            return null;
        },
        [maxSizeMB, allowedTypes],
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
                setFileMeta({ name: file.name, size: file.size });
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
        setFileMeta(null);
        setUploadError(null);
    }, [onChange]);

    const displayError = error || uploadError;

    if (value) {
        const displayName = fileMeta?.name || value.split("/").pop() || "Uploaded file";
        const displaySize = fileMeta ? formatBytes(fileMeta.size) : null;

        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                        {label}
                    </label>
                )}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                    }}
                >
                    <FileArchive style={{ width: 22, height: 22, color: "#6b7280", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                            {displayName}
                        </p>
                        {displaySize && (
                            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{displaySize}</p>
                        )}
                    </div>
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                border: "none",
                                background: "#f3f4f6",
                                color: "#6b7280",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                        >
                            <X style={{ width: 13, height: 13 }} />
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
                        <FileUp style={{ width: 28, height: 28, color: "#9ca3af" }} />
                        <span style={{ fontSize: 13, color: "#6b7280" }}>
                            Click or drag file to upload
                        </span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>
                            {FRIENDLY_TYPES} &middot; Max {maxSizeMB} MB
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
