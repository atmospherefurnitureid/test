"use client";

import { useState, useEffect } from "react";
import {
    Plus, Pencil, Trash2, Search, RotateCcw, Package, Play
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/lib/productStore";
import { Product } from "@/types";

export default function InventoryPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { products, deleteProduct, fetchProducts } = useProductStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) return <div className="animate-pulse bg-gray-50 h-[80vh] rounded-3xl" />;

    const filteredProducts = (products || []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleAddNew = () => {
        router.push("/dashboard/inventory/add");
    };

    const handleEdit = (product: Product) => {
        router.push(`/dashboard/inventory/edit/${product.code}`);
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Hapus produk "${product.name}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
            deleteProduct(product.code);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // 🔹 LIST VIEW
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage Atmosphere furniture stock and catalog.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        title="Reload data"
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                    >
                        <RotateCcw className="h-4 w-4" /> Reload
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition shadow-lg"
                    >
                        <Plus className="h-4 w-4" /> Add Product
                    </button>
                </div>
            </div>

            <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition font-medium placeholder:text-zinc-300"
                />
            </div>

            <div className="bg-white rounded-[var(--radius)] shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-left w-10">No</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-left">Kode Product</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-left">Product Name</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-left">Category</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Stock</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Price</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                                        {searchQuery ? `Tidak ditemukan produk untuk "${searchQuery}"` : "Belum ada produk. Klik 'Add Product' untuk mulai."}
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product, index) => (
                                <tr key={product.code} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-500">{product.code}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                                                {(() => {
                                                    const med = product.media[product.mainMediaIndex || 0];
                                                    if (!med) return <Package className="h-5 w-5 text-gray-300" />;
                                                    const isVideo = med.match(/\.(mp4|webm|ogg|quicktime)$/i) || med.includes("video") || med.startsWith("data:video");
                                                    return isVideo ? <Play className="h-5 w-5 text-zinc-400" /> : <img src={med} alt="" className="w-full h-full object-cover" />;
                                                })()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-900">{product.name}</p>
                                                <p className="text-xs text-zinc-400">{product.collection}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-zinc-100 rounded-full text-sm font-medium text-zinc-500">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`w-2 h-2 rounded-full ${product.status === 'Pre-order' ? 'bg-zinc-900 animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.2)]' :
                                                product.stock > 10 ? 'bg-green-500' :
                                                    product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                }`} />
                                            <span className="text-sm text-gray-900 font-medium">
                                                {product.status === 'Pre-order' ? 'Pre-order' : `${product.stock} Unit`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-zinc-900 text-right">Rp {product.price.toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
                                                title="Edit Produk"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
