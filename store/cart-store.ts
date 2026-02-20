"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import type { CartItem } from "@/lib/types";

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    itemCount: number;
    total: number;

    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    reset: () => void;
}

function computeTotals(items: CartItem[]) {
    return {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,
    itemCount: 0,
    total: 0,

    fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
            const items = await apiClient.get<CartItem[]>("/api/cart");
            set({ items, ...computeTotals(items), isLoading: false });
        } catch {
            set({ isLoading: false, error: "Failed to load cart" });
        }
    },

    addItem: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post("/api/cart", { productId, quantity });
            await get().fetchCart();
        } catch (e: unknown) {
            const err = e as { message?: string };
            set({ isLoading: false, error: err.message || "Failed to add item" });
            throw e;
        }
    },

    updateQuantity: async (productId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.patch("/api/cart/update", { productId, quantity });
            await get().fetchCart();
        } catch {
            set({ isLoading: false, error: "Failed to update quantity" });
        }
    },

    removeItem: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/api/cart/${productId}`);
            await get().fetchCart();
        } catch {
            set({ isLoading: false, error: "Failed to remove item" });
        }
    },

    clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post("/api/cart/clear");
            set({ items: [], itemCount: 0, total: 0, isLoading: false });
        } catch {
            set({ isLoading: false, error: "Failed to clear cart" });
        }
    },

    reset: () => set({ items: [], itemCount: 0, total: 0, isLoading: false, error: null }),
}));
