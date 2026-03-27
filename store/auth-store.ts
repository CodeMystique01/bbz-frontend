"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
    id: string;
    email: string;
    role: "BUYER" | "VENDOR" | "ADMIN";
    name?: string;
    isVendor: boolean;
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    activeRole: "BUYER" | "VENDOR";
    _hasHydrated: boolean;

    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    setUser: (user: AuthUser) => void;
    switchRole: (role: "BUYER" | "VENDOR") => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            activeRole: "BUYER",
            _hasHydrated: false,

            login: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    activeRole: user.isVendor ? "VENDOR" : "BUYER",
                }),

            logout: () =>
                set({ token: null, user: null, isAuthenticated: false, activeRole: "BUYER" }),

            setUser: (user) =>
                set({ user, activeRole: user.isVendor ? "VENDOR" : "BUYER" }),

            switchRole: (role) =>
                set({ activeRole: role }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                activeRole: state.activeRole,
            }),
            onRehydrateStorage: () => (_state, _error) => {
                // Always mark hydration complete, even if it errored
                useAuthStore.setState({ _hasHydrated: true });
            },
        }
    )
);
