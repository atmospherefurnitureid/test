"use client";

import { create } from "zustand";
import { Product } from "@/types";
import { generateSKU } from "@/lib/utils";

interface ProductStoreState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, "code">) => Promise<Product>;
    updateProduct: (code: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (code: string) => Promise<void>;
    getProductByCode: (code: string) => Product | null;
    fetchProductByCode: (code: string) => Promise<Product | null>;
}

import { DUMMY_PRODUCTS } from "@/lib/dummyData";

export const useProductStore = create<ProductStoreState>((set, get) => ({
    products: [], // Start with empty array
    isLoading: false,
    error: null,
    hasFetched: false, // Start as not fetched

    fetchProducts: async () => {
        if (get().hasFetched && get().products.length > 0) return;
        set({ isLoading: true, error: null });
        try {
            const response = await fetch("/api/products");
            if (!response.ok) throw new Error("Gagal mengambil data produk");
            const data: Product[] = await response.json();
            set({ products: data, hasFetched: true });
        } catch (err: any) {
            console.error("Fetch products error:", err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addProduct: async (product) => {
        set({ isLoading: true });
        try {
            const { products } = get();

            // Auto-generate product code menggunakan utility jika belum ada
            const existingCodes = products.map(p => p.code);
            const newCode = (product as any).code || generateSKU(product.label, product.category, existingCodes);

            const finalProduct = { ...product, code: newCode };

            const response = await fetch("/api/products", {
                method: "POST",
                body: JSON.stringify(finalProduct),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Gagal menambah produk");
            }

            const saved: Product = await response.json();
            set((state) => ({ products: [saved, ...state.products] }));
            return saved;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProduct: async (code, updates) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/products/${code}`, {
                method: "PUT",
                body: JSON.stringify(updates),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Gagal memperbarui produk");
            const updated: Product = await response.json();
            set((state) => ({
                products: state.products.map((p) =>
                    p.code === code ? { ...p, ...updated } : p
                ),
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProduct: async (code) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/products/${code}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Gagal menghapus produk");
            set((state) => ({
                products: state.products.filter((p) => p.code !== code),
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    getProductByCode: (code) => {
        return get().products.find((p) => p.code === code) || null;
    },

    // Fetch a single product directly from the API — used by detail page if store is empty
    fetchProductByCode: async (code) => {
        // Check store first so we don't re-fetch unnecessarily
        const existing = get().getProductByCode(code);
        if (existing) return existing;

        try {
            const response = await fetch(`/api/products/${code}`);
            if (!response.ok) return null;
            const product: Product = await response.json();
            // Merge into the store so other components can use it
            set((state) => {
                const alreadyInStore = state.products.some((p) => p.code === code);
                if (alreadyInStore) return state;
                return { products: [...state.products, product] };
            });
            return product;
        } catch {
            return null;
        }
    },
}));
