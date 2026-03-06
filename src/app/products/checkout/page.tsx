"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, CheckCircle2, CreditCard, Truck, ShieldCheck, Plus, Minus, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useTransactionStore } from "@/lib/transactionStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, clearCart, getTotal, toggleSelection, setSelectedAll } = useCartStore();
    const { addTransaction } = useTransactionStore();

    const selectedItemsCount = items.filter(i => i.selected).length;

    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [country, setCountry] = useState("Indonesia");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<any>("Bank Transfer");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsSubmitting(true);

        try {
            const newTrx = addTransaction({
                customerName,
                contact,
                address,
                country,
                shippingCost: 0,
                notes: "",
                items: items.map(item => ({
                    productCode: item.productCode,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: getTotal(),
                paymentMethod,
                status: "Draft",
                date: new Date().toISOString()
            });

            console.log("Transaction created:", newTrx);

            // Clear cart and show success
            clearCart();
            setIsSuccess(true);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-white text-zinc-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
                    <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight">Pesanan Berhasil Dibuat!</h1>
                    <p className="text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
                        Terima kasih telah berbelanja di Atmosphere Furniture. Tim kami akan segera menghubungi Anda untuk konfirmasi pengiriman.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products" className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-zinc-200">
                            Lihat Koleksi Lain
                        </Link>
                        <Link href="/" className="bg-white border border-zinc-200 text-zinc-900 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-zinc-50 transition-all">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-white text-zinc-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/products" className="bg-zinc-900 text-white px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-zinc-800">
                        Start Shopping
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50/50 text-zinc-900">
            <Navbar />

            <div className="mx-auto w-full max-w-7xl px-4 md:px-10 pt-12 pb-32">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm md:text-[15px] font-bold text-zinc-400 mb-8 tracking-tight hover:text-zinc-600 transition"
                >
                    <ArrowLeft className="h-5 w-5" /> Back to Products
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">CARTS</h1>
                        <span className="text-[12px] font-bold text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">{selectedItemsCount.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-32">
                    {/* Cart Items Section */}
                    <div className="w-full">
                        <div className="divide-y divide-zinc-100">
                            {/* Desktop Header for Cart (Hidden on mobile) */}
                            <div className="hidden lg:grid grid-cols-12 gap-4 py-4 px-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                <div className="col-span-1 flex items-center justify-center">Select</div>
                                <div className="col-span-4 pl-4">Product Details</div>
                                <div className="col-span-2 text-center">Unit Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-center">Total Price</div>
                                <div className="col-span-1 text-right pr-4">Actions</div>
                            </div>

                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`py-8 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-6 lg:gap-4 group px-4 -mx-4 transition-all duration-300 ${!item.selected ? "opacity-60 grayscale-[0.5]" : "hover:bg-zinc-50/50"}`}
                                >
                                    {/* Top Section: Checkbox, Image, and Info */}
                                    <div className="col-span-5 flex items-start lg:items-center gap-4">
                                        {/* Selection Checkbox */}
                                        <div className="pt-2 lg:pt-0">
                                            <button
                                                onClick={() => toggleSelection(item.id)}
                                                className={`h-5 w-5 rounded border-2 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer ${item.selected ? "bg-sky-500 border-sky-500" : "border-zinc-300 hover:border-zinc-400"}`}
                                            >
                                                {item.selected && (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-white">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        <div className="relative h-24 w-24 md:h-24 md:w-24 rounded-lg overflow-hidden bg-white border border-zinc-100 flex-shrink-0 shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                                unoptimized={item.image.startsWith("http") || item.image.startsWith("data:")}
                                            />
                                        </div>

                                        {/* Product Info & Unit Price (Mobile) */}
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <Link href={`/products/${item.id}`} className="block">
                                                <h3 className="text-[15px] lg:text-[18px] font-bold text-zinc-900 line-clamp-2 leading-tight hover:text-sky-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="flex flex-col gap-1.5">
                                                <Link href={`/products/${item.id}`} className="block">
                                                    <div className="flex items-center gap-2 text-[10px] lg:text-[11px] text-zinc-400 font-bold uppercase tracking-tight hover:text-sky-600 transition-colors">
                                                        <span>{item.productCode}</span>
                                                        <span className="text-zinc-200">|</span>
                                                        <span className="capitalize">{item.label?.toLowerCase() || "furniture"}</span>
                                                        <span className="text-zinc-200">|</span>
                                                        <span className="capitalize">{item.category?.toLowerCase() || "item"}</span>
                                                        {item.status === "Pre-order" && (
                                                            <>
                                                                <span className="text-zinc-200">|</span>
                                                                <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-black text-[9px]">PRE-ORDER</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </Link>
                                                {/* Price for Mobile only */}
                                                <div className="lg:hidden flex items-baseline gap-2 mt-1">
                                                    <span className="text-[14px] font-bold text-zinc-900">Rp {item.price.toLocaleString("id-ID")}</span>
                                                    <span className="text-[11px] text-zinc-400 line-through">Rp {item.normalPrice.toLocaleString("id-ID")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unit Price (Desktop only) */}
                                    <div className="hidden lg:flex col-span-2 text-center flex-col items-center">
                                        <p className="text-[12px] font-medium text-zinc-400 line-through mb-0.5">
                                            Rp {item.normalPrice.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-[16px] font-bold text-zinc-900">
                                            Rp {item.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {/* Bottom Section: Quantity, Subtotal, and Delete */}
                                    <div className="lg:contents flex items-center justify-between gap-4 pl-9 lg:pl-0">
                                        {/* Quantity Selector */}
                                        <div className="lg:col-span-2 flex justify-center">
                                            <div className="flex items-center border border-zinc-200 bg-white shadow-sm overflow-hidden rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                    className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center hover:bg-zinc-50 border-r border-zinc-200 transition-colors"
                                                >
                                                    <Minus className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-zinc-500" />
                                                </button>
                                                <div className="w-10 lg:w-14 text-center text-[14px] lg:text-[15px] font-bold text-zinc-900 border-none">
                                                    {item.quantity}
                                                </div>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center hover:bg-zinc-50 border-l border-zinc-200 transition-colors"
                                                >
                                                    <Plus className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-zinc-500" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal & Delete Group */}
                                        <div className="lg:col-span-3 flex items-center lg:grid lg:grid-cols-3 w-full lg:w-auto justify-between lg:justify-normal">
                                            <div className="lg:col-span-2 text-right lg:text-center">
                                                <p className="text-[16px] lg:text-[18px] font-black text-sky-500 tracking-tight">
                                                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            <div className="lg:col-span-1 text-right">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[12px] lg:text-[13px] text-zinc-400 hover:text-red-500 transition-colors py-2 px-3 lg:px-0"
                                                >
                                                    <Trash2 className="h-4 w-4 lg:hidden" />
                                                    <span className="hidden lg:inline">Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Information & Summary Section */}
                    <div className="w-full space-y-32">
                        {/* Customer Form */}
                        <section className="bg-white p-2">
                            <h2 className="text-3xl font-bold mb-10 tracking-tight">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-zinc-900">Name</label>
                                        <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your full name" className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-zinc-900">Email Address</label>
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-zinc-900">WhatsApp</label>
                                        <input required type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. +62 812..." className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-zinc-900">Country</label>
                                        <div className="relative">
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="w-full appearance-none bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all pr-10 font-medium cursor-pointer"
                                            >
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Japan">Japan</option>
                                                <option value="United States">United States</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-zinc-900">Address</label>
                                    <textarea required rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Complete shipping address..." className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium resize-none"></textarea>
                                </div>


                            </form>
                        </section>

                        <div className="space-y-8 pt-4">
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Summary</h2>

                            <div className="bg-white p-2 space-y-8">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-zinc-900">Total items</span>
                                        <span className="text-sm font-medium text-zinc-600">{selectedItemsCount.toString().padStart(2, '0')} Items</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-zinc-900">Sub total</span>
                                        <span className="text-sm font-medium text-zinc-600">Rp {getTotal().toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-sm font-bold text-zinc-900">Biaya Pengiriman</span>
                                        <span className="text-sm font-medium text-zinc-600">Dihitung oleh Admin</span>
                                    </div>

                                    <div className="border-t border-zinc-100 my-4" />

                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-zinc-900">Estimasi Total Pembayaran</span>
                                        <span className="text-2xl font-bold text-zinc-900 tracking-tight">Rp {getTotal().toLocaleString("id-ID")}</span>
                                    </div>
                                </div>



                                <div className="pt-4">
                                    <button
                                        form="checkout-form"
                                        type="submit"
                                        disabled={isSubmitting || selectedItemsCount === 0}
                                        className={`w-full rounded-xl py-4.5 font-black transition-all shadow-xl active:scale-[0.98] text-[15px] tracking-tight ${isSubmitting || selectedItemsCount === 0
                                            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                                            : "bg-zinc-900 text-white hover:bg-sky-500 cursor-pointer"
                                            }`}
                                    >
                                        {isSubmitting ? "MENGHUBUNGI ADMIN..." : "KONSULTASI SEKARANG"}
                                    </button>

                                    {/* Moved Global Payment Methods Section */}
                                    <div className="mt-12 pt-8 border-t border-zinc-100">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">Global Payment Methods</p>
                                        <div className="flex flex-wrap items-center gap-8">
                                            {/* BCA */}
                                            <div className="flex items-center">
                                                <span className="text-xl font-black text-[#0060AF] tracking-tighter">BCA</span>
                                            </div>
                                            {/* PayPal */}
                                            <div className="flex items-center">
                                                <span className="text-xl font-black text-[#003087] italic tracking-tighter">Pay<span className="text-[#009CDE]">Pal</span></span>
                                            </div>
                                            {/* Visa */}
                                            <div className="text-xl font-black text-[#1A1F71] italic tracking-tight">VISA</div>
                                            {/* Mastercard */}
                                            <div className="flex items-center gap-1">
                                                <div className="flex -space-x-2">
                                                    <div className="w-5 h-5 rounded-full bg-[#EB001B]"></div>
                                                    <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-80"></div>
                                                </div>
                                                <span className="font-bold text-zinc-900 text-[10px] italic">mastercard</span>
                                            </div>
                                        </div>
                                        <p className="mt-6 text-[12px] text-zinc-400 font-normal leading-relaxed italic">
                                            * Our admin will contact you to confirm the best payment method for your location.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
