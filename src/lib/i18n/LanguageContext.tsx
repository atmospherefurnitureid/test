"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

import { id } from "./locales/id";
import { en } from "./locales/en";

const localeData = { ID: id, EN: en };

type Language = "ID" | "EN";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("ID");
    const [isReady, setIsReady] = useState(false);

    // Initial load
    useEffect(() => {
        const savedLang = localStorage.getItem("atmosphere_lang") as Language;
        if (savedLang && (savedLang === "ID" || savedLang === "EN")) {
            setLanguageState(savedLang);
        } else {
            const userLang = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
            if (userLang.startsWith("id")) {
                setLanguageState("ID");
            } else {
                setLanguageState("EN");
            }
        }
        setIsReady(true);
    }, []);

    // Sync HTML lang attribute
    useEffect(() => {
        if (isReady) {
            document.documentElement.lang = language.toLowerCase();
        }
    }, [language, isReady]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("atmosphere_lang", lang);
    }, []);

    const t = useCallback((keyPath: string) => {
        const keys = keyPath.split(".");
        let result: any = localeData[language];

        for (const key of keys) {
            if (result && typeof result === 'object' && result[key] !== undefined) {
                result = result[key];
            } else {
                return keyPath;
            }
        }
        return result;
    }, [language]);

    const contextValue = React.useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language, setLanguage, t]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
