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
        const selectedItems = items.filter(i => i.selected);
        if (selectedItems.length === 0) return;

        setIsSubmitting(true);

        try {
            // Build WhatsApp Message
            const itemsList = selectedItems.map(item => `- *${item.name}* (${item.productCode}) x${item.quantity} : Rp ${item.price.toLocaleString("id-ID")}`).join('%0A');
            const waMessage = `Halo Atmosphere Furniture Indonesia,%0A%0ASaya *${customerName}*, ingin melakukan *Konsultasi Pesanan*.%0A%0ABerikut detail saya:%0A- *Nama*: ${customerName}%0A- *Email*: ${email}%0A- *WhatsApp*: ${contact}%0A- *Alamat*: ${address}%0A%0A*Daftar Produk*:%0A${itemsList}%0A%0A*Total Pembayaran (Estimasi)*: *Rp ${getTotal().toLocaleString("id-ID")}*%0A%0AMohon bantuan informasinya untuk pengiriman dan metode pembayaran. Terima kasih!`;
            const waLink = `https://wa.me/62882005824231?text=${waMessage}`;

            // Create Transaction Record (Client-side store)
            const newTrx = addTransaction({
                customerName,
                contact,
                address,
                country,
                shippingCost: 0,
                notes: "",
                items: selectedItems.map(item => ({
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

            // Open WhatsApp in new tab
            window.open(waLink, "_blank");

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
            <main className="h-screen flex flex-col bg-zinc-50/50 text-zinc-900 overflow-hidden">
                <Navbar />
                
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-2xl w-full text-center space-y-8">
                        <div className="relative inline-block group">
                            <div className="absolute -inset-4 bg-green-500/5 rounded-full blur-2xl transition-colors duration-500" />
                            <div className="relative h-32 w-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-green-100/50 border border-green-50 mb-2">
                                <CheckCircle2 className="h-14 w-14 text-green-500" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-zinc-900 leading-[1.05]">
                                Order Successfully<br />Placed!
                            </h1>
                            <p className="text-base md:text-lg text-zinc-500 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                                Thank you for choosing Atmosphere Furniture. Our team will contact you shortly via WhatsApp or Email to confirm your order and shipping details.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/products" className="w-full sm:w-auto bg-sky-500 text-white px-10 py-4.5 rounded-2xl font-semibold text-[15px] hover:bg-sky-600 transition-all shadow-xl shadow-sky-100">
                                Browse More
                            </Link>
                            <Link href="/" className="w-full sm:w-auto bg-white border border-zinc-200 text-zinc-900 px-10 py-4.5 rounded-2xl font-semibold text-[15px] hover:bg-zinc-50 transition-all shadow-sm">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="py-8 px-6 text-center text-[13px] font-medium text-zinc-400">
                    &copy; {new Date().getFullYear()} Atmosphere Furniture Indonesia. Bridging Tradition & Innovation.
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="h-screen flex flex-col bg-zinc-50/50 text-zinc-900 overflow-hidden">
                <Navbar />
                
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-xl w-full text-center space-y-8">
                        <div className="relative inline-block mb-10">
                            <ShoppingBag className="h-16 w-16 text-sky-500" />
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-zinc-900 leading-[1.05]">
                                Your cart is<br />feeling a bit light
                            </h1>
                            <p className="text-base md:text-lg text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                                Explore our collection of premium furniture and find the perfect pieces to bring soul to your space.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/products" className="w-full sm:w-auto bg-sky-500 text-white px-10 py-4.5 rounded-2xl font-semibold text-[15px] transition-all hover:bg-sky-600 shadow-xl shadow-sky-100 flex items-center justify-center gap-2 group">
                                Start Exploring
                                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                            </Link>
                            <Link href="/" className="w-full sm:w-auto bg-white text-zinc-600 border border-zinc-200 px-10 py-4.5 rounded-2xl font-semibold text-[15px] transition-all hover:bg-zinc-50 flex items-center justify-center">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="py-8 px-6 text-center text-[13px] font-medium text-zinc-400">
                    &copy; {new Date().getFullYear()} Atmosphere Furniture Indonesia. Bridging Tradition & Innovation.
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50/50 text-zinc-900">
            <Navbar />

            <div className="mx-auto w-full max-w-7xl px-4 md:px-10 pt-4 md:pt-12 pb-32">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-base font-semibold text-zinc-400 mb-6 md:mb-8 tracking-tight hover:text-zinc-600 transition"
                >
                    <ArrowLeft className="h-5 w-5" /> Back to Products
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.1]">CARTS</h1>
                        <span className="text-[12px] font-semibold text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">{selectedItemsCount.toString().padStart(2, '0')}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-20 md:gap-32">
                    {/* Cart Items Section */}
                    <div className="w-full">
                        <div className="divide-y divide-zinc-100 border-t border-zinc-100">
                            {/* Desktop Header for Cart (Hidden on mobile) */}
                            <div className="hidden lg:grid grid-cols-12 gap-4 py-6 px-4 text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
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
                                    className={`py-6 md:py-8 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 lg:gap-4 group px-0 md:px-4 transition-all duration-300 ${!item.selected ? "opacity-60 grayscale-[0.5]" : "hover:bg-zinc-50/50"}`}
                                >
                                    {/* Top Section: Checkbox, Image, and Info */}
                                    <div className="col-span-5 flex items-start lg:items-center gap-3 md:gap-4">
                                        {/* Selection Checkbox */}
                                        <div className="pt-1.5 lg:pt-0">
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

                                        <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden bg-white border border-zinc-100 flex-shrink-0 shadow-sm">
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
                                        <div className="flex-1 space-y-0.5 min-w-0 pr-2">
                                            <Link href={`/products/${item.id}`} className="block">
                                                <h3 className="text-[13px] md:text-[18px] font-semibold text-zinc-900 line-clamp-2 leading-tight hover:text-sky-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="flex flex-col gap-0.5">
                                                <Link href={`/products/${item.id}`} className="block">
                                                    <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[11px] text-zinc-400 font-semibold uppercase tracking-tight hover:text-sky-600 transition-colors">
                                                        <span>{item.productCode}</span>
                                                        <span className="text-zinc-200">|</span>
                                                        <span className="capitalize">{item.category?.toLowerCase() || "item"}</span>
                                                        {item.status === "Pre-order" && (
                                                            <>
                                                                <span className="text-zinc-200">|</span>
                                                                <span className="text-amber-600 bg-amber-50 px-1 rounded font-semibold text-[7px] md:text-[9px]">PO</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </Link>
                                                {/* Price for Mobile only */}
                                                <div className="lg:hidden flex items-baseline gap-2">
                                                    <span className="text-[12px] font-bold text-zinc-900">Rp {item.price.toLocaleString("id-ID")}</span>
                                                    <span className="text-[9px] text-red-500 line-through font-medium">Rp {item.normalPrice.toLocaleString("id-ID")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unit Price (Desktop only) */}
                                    <div className="hidden lg:flex col-span-2 text-center flex-col items-center">
                                        <p className="text-[12px] font-bold text-red-500 line-through mb-0.5">
                                            Rp {item.normalPrice.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-[16px] font-semibold text-zinc-900">
                                            Rp {item.price.toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {/* Bottom Section: Quantity, Subtotal, and Delete */}
                                    <div className="lg:contents flex items-center justify-between gap-4 pl-8 md:pl-9 lg:pl-0">
                                        {/* Quantity Selector */}
                                        <div className="lg:col-span-2 flex justify-center">
                                            <div className="flex items-center border border-zinc-200 bg-white shadow-sm overflow-hidden rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                    className="h-6 w-6 md:h-9 md:w-9 flex items-center justify-center hover:bg-zinc-50 border-r border-zinc-200 transition-colors"
                                                >
                                                    <Minus className="h-2 w-2 md:h-3.5 md:w-3.5 text-zinc-500" />
                                                </button>
                                                <div className="w-7 md:w-14 text-center text-[11px] md:text-[15px] font-bold text-zinc-900 border-none">
                                                    {item.quantity}
                                                </div>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="h-6 w-6 md:h-9 md:w-9 flex items-center justify-center hover:bg-zinc-50 border-l border-zinc-200 transition-colors"
                                                >
                                                    <Plus className="h-2 w-2 md:h-3.5 md:w-3.5 text-zinc-500" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal & Delete Group */}
                                        <div className="lg:col-span-3 flex items-center lg:grid lg:grid-cols-3 w-full lg:w-auto justify-end lg:justify-normal gap-4">
                                            <div className="lg:col-span-2 text-right lg:text-center">
                                                <p className="text-base md:text-2xl font-bold text-sky-500 tracking-tight">
                                                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            <div className="lg:col-span-1 text-right flex justify-end">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="inline-flex items-center justify-center bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-lg transition-all cursor-pointer shadow-md shadow-red-200/50 active:scale-95 grayscale-0 opacity-100"
                                                    title="Remove Item"
                                                    style={{ 
                                                        backgroundColor: '#dc2626',
                                                        width: '80px',
                                                        height: '40px'
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 lg:mr-1.5 text-white" />
                                                    <span className="hidden lg:inline text-[12px] font-bold text-white">Hapus</span>
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
                        <section className="bg-white p-2 text-left">
                            <h2 className="text-3xl md:text-5xl font-semibold mb-10 tracking-tight text-zinc-900 leading-[1.1]">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-semibold text-zinc-900 flex items-center gap-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your full name" className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-semibold text-zinc-900 flex items-center gap-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-semibold text-zinc-900 flex items-center gap-1">
                                            WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input required type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. +62 812..." className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-semibold text-zinc-900 flex items-center gap-1">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="w-full appearance-none bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all pr-10 font-medium cursor-pointer"
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
                                    <label className="text-base font-semibold text-zinc-900 flex items-center gap-1">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea required rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Complete shipping address..." className="w-full bg-transparent border-b border-zinc-200 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium resize-none"></textarea>
                                </div>


                            </form>
                        </section>

                        <div className="space-y-8 pt-4">
                            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.1]">Summary</h2>

                            <div className="bg-white p-2 space-y-8">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-left">
                                        <span className="text-[15px] font-medium text-zinc-900">Total items</span>
                                        <span className="text-[15px] font-medium text-zinc-600">{selectedItemsCount.toString().padStart(2, '0')} Items</span>
                                    </div>
                                    <div className="flex justify-between items-center text-left">
                                        <span className="text-[15px] font-medium text-zinc-900">Sub total</span>
                                        <span className="text-[15px] font-medium text-zinc-600">Rp {getTotal().toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-left">
                                        <span className="text-[15px] font-medium text-zinc-900">Biaya Pengiriman</span>
                                        <span className="text-[15px] font-medium text-zinc-600">Dihitung oleh Admin</span>
                                    </div>

                                    <div className="border-t border-zinc-100 my-4" />

                                    <div className="flex justify-between items-center text-left">
                                        <span className="text-base font-semibold text-zinc-900">Estimasi Total Pembayaran</span>
                                        <span className="text-2xl font-semibold text-zinc-900 tracking-tight">Rp {getTotal().toLocaleString("id-ID")}</span>
                                    </div>
                                </div>



                                <div className="pt-4">
                                    <button
                                        form="checkout-form"
                                        type="submit"
                                        disabled={isSubmitting || selectedItemsCount === 0 || !customerName || !email || !contact || !address}
                                        className={`w-full rounded-2xl py-5 font-semibold transition-all shadow-xl active:scale-[0.98] text-[15px] tracking-tight ${isSubmitting || selectedItemsCount === 0 || !customerName || !email || !contact || !address
                                            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                                            : "bg-sky-500 text-white hover:bg-sky-600 cursor-pointer"
                                            }`}
                                    >
                                        {isSubmitting ? "MENGHUBUNGI ADMIN..." : "KONSULTASI SEKARANG"}
                                    </button>

                                    {/* Moved Global Payment Methods Section */}
                                    <div className="mt-12 pt-8 border-t border-zinc-100 text-left">
                                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.2em] mb-6">Global Payment Methods</p>
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
