"use client";

import { create } from "zustand";
import { Article } from "@/types";

export type GlobalArticle = Article & {
    status: "Published" | "Draft" | "Scheduled";
};

export interface ArticleCategory {
    _id?: string;
    name: string;
}

export interface GlobalComment {
    _id?: string;
    id: number;
    articleId: string;
    author: string;
    email: string;
    whatsapp?: string;
    content: string;
    status: "Pending" | "Approved" | "Spam";
    replied?: boolean;
    adminReply?: string;
    timestamp: string;
}

export interface SocialShareSettings {
    enableWhatsapp: boolean;
    enableFacebook: boolean;
    enableInstagram: boolean;
    enableCopyLink: boolean;
}

interface ContentStoreState {
    articles: GlobalArticle[];
    categories: ArticleCategory[];
    comments: GlobalComment[];
    socialShare: SocialShareSettings;
    isLoading: boolean;
    error: string | null;
    hasFetchedArticles: boolean;
    hasFetchedComments: boolean;

    // Actions
    fetchArticles: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchComments: () => Promise<void>;

    addArticle: (article: Omit<GlobalArticle, "_id">) => Promise<GlobalArticle>;
    updateArticle: (id: string, updates: Partial<GlobalArticle>) => Promise<void>;
    deleteArticle: (id: string) => Promise<void>;

    addCategory: (name: string) => Promise<void>;
    deleteCategory: (id: string, name: string) => Promise<boolean>;

    addComment: (comment: any) => Promise<GlobalComment>;
    updateComment: (id: string | number, updates: Partial<GlobalComment>) => Promise<GlobalComment>;
    deleteComment: (id: string | number) => Promise<void>;

    updateSocialShare: (updates: Partial<SocialShareSettings>) => void;
    uploadMedia: (file: File) => Promise<string>;
}

import { DUMMY_ARTICLES, DUMMY_CATEGORIES } from "@/lib/dummyData";

const STORAGE_KEY_SOCIAL_SHARE = "atm_social_share_v1";

export const useContentStore = create<ContentStoreState>((set, get) => ({
    articles: [],
    categories: [],
    comments: [],
    socialShare: {
        enableWhatsapp: true,
        enableFacebook: true,
        enableInstagram: true,
        enableCopyLink: true,
    },
    isLoading: false,
    error: null,
    hasFetchedArticles: false,
    hasFetchedComments: false,

    fetchCategories: async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error("Gagal mengambil kategori");
            const data = await response.json();
            set({ categories: data });
        } catch (err) {
            console.error("Fetch categories error:", err);
        }
    },

    fetchArticles: async () => {
        if (get().hasFetchedArticles && get().articles.length > 0) return;
        set({ isLoading: true });
        try {
            const response = await fetch('/api/articles');
            if (!response.ok) throw new Error("Gagal mengambil artikel");
            const data = await response.json();
            set({ articles: data, hasFetchedArticles: true });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchComments: async () => {
        try {
            const response = await fetch('/api/comments');
            if (response.ok) {
                const data = await response.json();
                set({ comments: data, hasFetchedComments: true });
            }
        } catch (err) {
            console.error("Fetch comments error:", err);
        }
    },

    addArticle: async (article) => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                body: JSON.stringify(article),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Gagal menambah artikel");
            const saved = await response.json();
            set(state => ({ articles: [saved, ...state.articles] }));
            return saved;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    updateArticle: async (id, updates) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Gagal memperbarui artikel");
            const updated = await response.json();
            set(state => ({
                articles: state.articles.map(a => a._id === id ? updated : a)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteArticle: async (id) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Gagal menghapus artikel");
            set(state => ({
                articles: state.articles.filter(a => a._id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (name) => {
        const { categories } = get();
        if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const newCat = await response.json();
                set(state => ({ categories: [...state.categories, newCat] }));
            }
        } catch (err) {
            console.error("Add category error:", err);
        }
    },

    deleteCategory: async (id, name) => {
        try {
            const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (response.ok) {
                set(state => ({ categories: state.categories.filter(c => c._id !== id) }));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Delete category error:", err);
            return false;
        }
    },

    addComment: async (comment) => {
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                body: JSON.stringify(comment),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Gagal mengirim komentar");
            const saved = await response.json();
            set(state => ({ comments: [saved, ...state.comments] }));
            return saved;
        } catch (err) {
            console.error("Add comment error:", err);
            throw err;
        }
    },

    updateComment: async (id, updates) => {
        try {
            const response = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Gagal update komentar");
            const updated = await response.json();
            set(state => ({
                comments: state.comments.map(c => (c._id === id || (c as any).id === id) ? updated : c)
            }));
            return updated;
        } catch (err) {
            console.error("Update comment error:", err);
            throw err;
        }
    },

    deleteComment: async (id) => {
        try {
            const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
            if (response.ok) {
                set(state => ({
                    comments: state.comments.filter(c => (c._id !== id && (c as any).id !== id))
                }));
            }
        } catch (err) {
            console.error("Delete comment error:", err);
            throw err;
        }
    },

    updateSocialShare: (updates) => {
        const current = get().socialShare;
        const updated = { ...current, ...updates };
        set({ socialShare: updated });
        localStorage.setItem(STORAGE_KEY_SOCIAL_SHARE, JSON.stringify(updated));
    },

    uploadMedia: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Gagal upload media');
        const data = await response.json();
        return data.url;
    },
}));
