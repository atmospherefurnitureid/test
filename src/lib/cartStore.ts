"use client";

import { useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: string;
    productCode: string;
    name: string;
    category: string;
    label: string;
    price: number;
    normalPrice: number;
    image: string;
    quantity: number;
    selected: boolean;
    status: string;
}

const STORAGE_KEY = "atm_cart";

function loadCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as any[];
            return parsed.map(item => ({
                ...item,
                productCode: item.productCode || (item as any).productId || "",
                normalPrice: item.normalPrice || item.price * 1.2,
                selected: typeof item.selected === 'boolean' ? item.selected : true,
                category: item.category || "",
                label: item.label || "",
                status: item.status || "Pre-order"
            })) as CartItem[];
        }
    } catch {
        // ignore parse errors
    }
    return [];
}

function saveCart(items: CartItem[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // ignore storage errors
    }
}

// Singleton state to share across all hook instances within the same tab
let globalCartItems: CartItem[] = [];

// Helper to initialize cart on first possible moment
// Removed global initialization to prevent hydration mismatch

export function useCartStore() {
    const [items, setItems] = useState<CartItem[]>([]);

    const syncItems = useCallback(() => {
        const loaded = loadCart();
        globalCartItems = loaded;
        setItems(loaded);
    }, []);

    useEffect(() => {
        // Initial sync
        syncItems();

        // Listen for changes from other tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                syncItems();
            }
        };

        // Listen for internal updates
        const handleSync = () => syncItems();

        window.addEventListener("storage", handleStorage);
        window.addEventListener("cart-updated", handleSync);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("cart-updated", handleSync);
        };
    }, [syncItems]);

    const persist = useCallback((updated: CartItem[]) => {
        saveCart(updated);
        globalCartItems = updated;
        setItems(updated);
        window.dispatchEvent(new Event("cart-updated"));
    }, []);

    const addToCart = useCallback((product: any, quantity = 1) => {
        const currentItems = loadCart();

        // Find if the exact same product is already in the cart
        const existingItemIndex = currentItems.findIndex(
            (item) => item.productCode === product.code
        );

        let updated: CartItem[];
        if (existingItemIndex >= 0) {
            updated = [...currentItems];
            updated[existingItemIndex] = {
                ...updated[existingItemIndex],
                quantity: updated[existingItemIndex].quantity + quantity
            };
        } else {
            updated = [
                ...currentItems,
                {
                    id: Math.random().toString(36).substring(7),
                    productCode: product.code,
                    name: product.name,
                    category: product.category || "",
                    label: product.label || "",
                    price: product.memberPrice || product.price,
                    normalPrice: product.price,
                    image: product.media?.[0] || product.images?.[0] || "",
                    quantity: quantity,
                    selected: true,
                    status: product.status || "Pre-order",
                },
            ];
        }
        persist(updated);
    }, [persist]);

    const toggleSelection = useCallback((itemId: string) => {
        const current = loadCart();
        persist(current.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)));
    }, [persist]);

    const setSelectedAll = useCallback((val: boolean) => {
        const current = loadCart();
        persist(current.map((item) => ({ ...item, selected: val })));
    }, [persist]);

    const removeFromCart = useCallback((itemId: string) => {
        const current = loadCart();
        persist(current.filter((item) => item.id !== itemId));
    }, [persist]);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        const current = loadCart();
        persist(current.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    }, [persist, removeFromCart]);

    const clearCart = useCallback(() => {
        persist([]);
    }, [persist]);

    const getTotal = useCallback(() => {
        return items.filter(i => i.selected).reduce((total, item) => total + item.price * item.quantity, 0);
    }, [items]);

    return { items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, toggleSelection, setSelectedAll };
}
