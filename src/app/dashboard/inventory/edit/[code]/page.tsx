"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/productStore";
import { Product } from "@/types";
import ProductForm from "../../ProductForm";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const code = params.code as string;
    const { products, updateProduct, fetchProductByCode } = useProductStore();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!code) return;

        const inStore = products.find((p) => p.code === code);
        if (inStore) {
            setProduct(inStore);
            return;
        }

        // Store empty (direct URL access) — fetch from API
        fetchProductByCode(code).then((result) => {
            if (result) {
                setProduct(result);
            } else {
                setNotFound(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, products]);

    const handleSave = async (data: any) => {
        try {
            await updateProduct(code, data);
            router.push("/dashboard/inventory");
        } catch (err: any) {
            alert(err.message || "Gagal memperbarui produk");
        }
    };

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <p className="text-red-500 font-medium">Produk tidak ditemukan.</p>
                <button
                    onClick={() => router.push("/dashboard/inventory")}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-semibold"
                >
                    Kembali ke Inventory
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
                <p className="text-zinc-500 font-medium">Memuat data produk...</p>
            </div>
        );
    }

    return (
        <ProductForm
            initialData={product}
            title={`Edit: ${product?.name || "Produk"}`}
            subtitle={`Kode: ${code}`}
            onSave={handleSave}
            onCancel={() => router.push("/dashboard/inventory")}
        />
    );
}
