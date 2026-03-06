"use client";

import { useState, useEffect, useCallback } from "react";

export interface TransactionItem {
    productCode: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface Transaction {
    id: string;
    orderId: string;
    customerName: string;
    contact: string;
    address: string;
    country: string;
    items: TransactionItem[];
    shippingCost: number;
    totalAmount: number;
    notes: string;
    status: "Draft" | "DP (50%)" | "Sedang dikerjakan" | "Selesai Produksi" | "Pengiriman" | "Selesai" | "Cancelled";
    paymentMethod: "Bank Transfer" | "Credit Card" | "Virtual Account" | "E-Wallet" | "Cash on Delivery";
    date: string;
    deliveryDate?: string;
    isStockProcessed?: boolean;
}

const STORAGE_KEY = "atm_transactions";

// Helper to generate some initial mock data if empty
function generateInitialTransactions(): Transaction[] {
    return Array.from({ length: 5 }).map((_, i) => {
        const date = new Date("2026-03-02T10:00:00Z");
        date.setDate(date.getDate() - (i % 15));

        const prefix = ["W-", "I-", "WI-"][i % 3];
        const cat = ["11", "21", "22"][i % 3];
        const mockCode = `${prefix}${cat}00${i + 1}`;

        return {
            id: `TRX-${10000 + i}`,
            orderId: `ORD-${50000 + i}`,
            customerName: ["Budi Santoso", "Siti Aminah", "Rina Gunawan", "Andi Pratama", "Dewi Lestari"][i % 5],
            contact: `08123456789${i}`,
            address: "Jl. Sudirman No. 123, Jakarta",
            country: "Indonesia",
            items: [
                {
                    productCode: mockCode,
                    productName: ["Kursi Minimalis", "Meja Kayu", "Lemari Jati", "Sofa Bed", "Rak Buku"][i % 5],
                    quantity: 1,
                    price: 500000 + (i * 250000) % 5000000
                }
            ],
            shippingCost: 150000,
            totalAmount: 500000 + (i * 250000) % 5000000 + 150000,
            notes: "Pesanan custom finishing",
            status: ["Selesai", "DP (50%)", "Sedang dikerjakan", "Draft", "Cancelled"][i % 5] as Transaction["status"],
            paymentMethod: ["Bank Transfer", "Credit Card", "Virtual Account", "E-Wallet"][i % 4] as Transaction["paymentMethod"],
            date: date.toISOString(),
            deliveryDate: (new Date(date.getTime() + 86400000 * 3)).toISOString().split('T')[0],
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function loadTransactions(): Transaction[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as any[];
            return parsed.map(trx => ({
                ...trx,
                items: trx.items.map((item: any) => ({
                    ...item,
                    productCode: item.productCode || item.productId || ""
                }))
            })) as Transaction[];
        }
    } catch {
        // ignore parse errors
    }
    const initial = generateInitialTransactions();
    saveTransactions(initial);
    return initial;
}

function saveTransactions(transactions: Transaction[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
        // ignore storage errors
    }
}

export function useTransactionStore() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        setTransactions(loadTransactions());
    }, []);

    const persist = useCallback((updated: Transaction[]) => {
        setTransactions(updated);
        saveTransactions(updated);
    }, []);

    const addTransaction = useCallback((transaction: Omit<Transaction, "id" | "orderId">) => {
        const idStr = String(Date.now()).slice(-5);
        const newTransaction: Transaction = {
            ...transaction,
            id: `TRX-${idStr}`,
            orderId: `ORD-${parseInt(idStr) + 40000}`
        };
        persist([newTransaction, ...loadTransactions()]);
        return newTransaction;
    }, [persist]);

    const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
        const current = loadTransactions();
        const updated = current.map(t => t.id === id ? { ...t, ...updates } : t);
        persist(updated);
    }, [persist]);

    const updateTransactionStatus = useCallback((id: string, newStatus: Transaction["status"]) => {
        updateTransaction(id, { status: newStatus });
    }, [updateTransaction]);

    const deleteTransaction = useCallback((id: string) => {
        const current = loadTransactions();
        persist(current.filter(t => t.id !== id));
    }, [persist]);

    return { transactions, addTransaction, updateTransaction, updateTransactionStatus, deleteTransaction };
}
