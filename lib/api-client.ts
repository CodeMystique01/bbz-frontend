"use client";

// ── Typed API Client with JWT auth ──────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

class ApiClientError extends Error {
    status: number;
    details?: unknown;

    constructor({ message, status, details }: ApiError) {
        super(message);
        this.name = "ApiClientError";
        this.status = status;
        this.details = details;
    }
}

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem("auth-storage");
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed?.state?.token || null;
    } catch {
        return null;
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
        delete headers["Content-Type"];
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    const isAuthEndpoint = endpoint.includes("/api/auth/");
    if (res.status === 401 && !isAuthEndpoint) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage");
            window.location.href = "/login";
        }
        throw new ApiClientError({ message: "Session expired. Please log in again.", status: 401 });
    }

    if (!res.ok) {
        let errorData: { message?: string; error?: string } = {};
        try {
            errorData = await res.json();
        } catch {
            // ignore parse errors
        }
        throw new ApiClientError({
            message: errorData.message || errorData.error || `Request failed (${res.status})`,
            status: res.status,
            details: errorData,
        });
    }

    // Handle 204 No Content
    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint),

    post: <T>(endpoint: string, body?: unknown) =>
        request<T>(endpoint, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(endpoint: string, body?: unknown) =>
        request<T>(endpoint, {
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(endpoint: string, body?: unknown) =>
        request<T>(endpoint, {
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: "DELETE" }),

    upload: <T>(endpoint: string, formData: FormData) =>
        request<T>(endpoint, {
            method: "POST",
            body: formData,
        }),
};

export { ApiClientError };
export type { ApiError };
