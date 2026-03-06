"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (props: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ title, description, type }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-0 right-0 p-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="pointer-events-auto bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-right fade-in duration-300"
                    >
                        <div className={`mt-0.5 rounded-full p-1 ${t.type === "success" ? "bg-emerald-50 text-emerald-600" :
                                t.type === "error" ? "bg-red-50 text-red-600" :
                                    t.type === "warning" ? "bg-amber-50 text-amber-600" :
                                        "bg-blue-50 text-blue-600"
                            }`}>
                            {t.type === "success" && <CheckCircle2 className="h-5 w-5" />}
                            {t.type === "error" && <XCircle className="h-5 w-5" />}
                            {t.type === "warning" && <AlertCircle className="h-5 w-5" />}
                            {t.type === "info" && <Info className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-zinc-900 leading-tight">{t.title}</h4>
                            {t.description && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{t.description}</p>}
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
