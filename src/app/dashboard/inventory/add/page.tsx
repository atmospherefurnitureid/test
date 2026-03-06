"use client";

import { useRouter } from "next/navigation";
import { useProductStore } from "@/lib/productStore";
import ProductForm from "../ProductForm";

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useProductStore();

    const handleSave = (data: any) => {
        addProduct(data);
        router.push("/dashboard/inventory");
    };

    return (
        <ProductForm
            title="Tambah Produk Baru"
            subtitle="Isi semua informasi produk di bawah ini"
            onSave={handleSave}
            onCancel={() => router.push("/dashboard/inventory")}
        />
    );
}
