import React from "react";
import { Link, useLocation } from "react-router";

const OrderSuccess = () => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    const payment = location.state?.payment;
    const orderItems = payment?.orderItems || [];

    const totalAmount = payment?.price?.amount || 0;
    const currency = payment?.price?.currency || "INR";

    const formatPrice = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    /*
     * Keep variant extraction flexible.
     *
     * If your backend stores variantName directly,
     * it will use that first.
     *
     * Otherwise it checks common variant attribute
     * structures without breaking the page.
     */
    const getVariantName = (item) => {
        if (item.variantName) {
            return item.variantName;
        }

        if (item.variant?.name) {
            return item.variant.name;
        }

        if (item.variant?.attributes) {
            const attributes = item.variant.attributes;

            if (attributes instanceof Map) {
                return Array.from(attributes.values()).join(" / ");
            }

            if (typeof attributes === "object") {
                return Object.values(attributes).join(" / ");
            }
        }

        return null;
    };

    // If someone refreshes the page, router state disappears.
    if (!payment) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] text-[#111] flex items-center justify-center px-6">
                <div className="text-center max-w-md">

                    <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-6">
                        SNITCH
                    </p>

                    <h1 className="text-4xl md:text-5xl tracking-[-0.04em] font-medium">
                        Order unavailable.
                    </h1>

                    <p className="mt-5 text-sm leading-6 text-neutral-500">
                        This order confirmation is no longer available on this
                        page. You can continue shopping or check your orders
                        from your account.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex mt-8 bg-[#111] text-white px-8 py-4 text-[10px] tracking-[0.22em] uppercase hover:bg-neutral-800 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#111]">

            {/* ───────────────── HEADER ───────────────── */}

            <header className="border-b border-black/10">
                <div className="max-w-[1180px] mx-auto px-6 md:px-8 h-[82px] flex items-center justify-between">

                    <Link
                        to="/"
                        className="text-[21px] font-semibold tracking-[0.22em]"
                    >
                        SNITCH
                    </Link>

                    <div className="hidden sm:block text-[9px] tracking-[0.28em] uppercase text-neutral-400">
                        Order Confirmation
                    </div>

                </div>
            </header>


            {/* ───────────────── MAIN ───────────────── */}

            <main className="max-w-[1180px] mx-auto px-6 md:px-8">

                {/* ───────────── CONFIRMATION HERO ───────────── */}

                <section className="py-16 md:py-20 border-b border-black/10">

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-24 items-end">

                        <div>

                            <div className="flex items-center gap-3 mb-7">

                                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[11px]">
                                    ✓
                                </span>

                                <span className="text-[9px] tracking-[0.28em] uppercase text-neutral-400">
                                    Order Confirmed
                                </span>

                            </div>

                            <h1 className="text-[44px] leading-[1.05] md:text-[68px] tracking-[-0.055em] font-medium">
                                Thank you for
                                <br />
                                your order.
                            </h1>

                            <p className="mt-7 max-w-[570px] text-[14px] leading-7 text-neutral-500">
                                Your payment has been verified and your order
                                is now being prepared. We'll take care of the
                                rest.
                            </p>

                        </div>


                        {/* ORDER META */}

                        <div className="lg:border-l lg:border-black/10 lg:pl-10">

                            <div className="mb-7">

                                <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 mb-3">
                                    Order ID
                                </p>

                                <p className="text-[13px] font-medium break-all">
                                    {orderId ||
                                        payment?.razorpay?.orderId ||
                                        "—"}
                                </p>

                            </div>

                            <div>

                                <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 mb-3">
                                    Payment Status
                                </p>

                                <div className="flex items-center gap-2">

                                    <span className="w-2 h-2 rounded-full bg-black" />

                                    <span className="text-[10px] tracking-[0.2em] uppercase">
                                        Paid
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ───────────── ORDER CONTENT ───────────── */}

                <section className="py-14 md:py-20">

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-14 lg:gap-20">


                        {/* ───────── YOUR SELECTION ───────── */}

                        <div>

                            <div className="flex items-end justify-between pb-6 border-b border-black/10">

                                <div>

                                    <p className="text-[9px] tracking-[0.28em] uppercase text-neutral-400 mb-3">
                                        Your Selection
                                    </p>

                                    <h2 className="text-[26px] tracking-[-0.035em] font-medium">
                                        Order Summary
                                    </h2>

                                </div>

                                <span className="text-[10px] text-neutral-400">
                                    {orderItems.length}{" "}
                                    {orderItems.length === 1
                                        ? "item"
                                        : "items"}
                                </span>

                            </div>


                            {/* ITEMS */}

                            <div>

                                {orderItems.map((item, index) => {

                                    const image =
                                        item.images?.[0]?.url ||
                                        item.images?.[0] ||
                                        null;

                                    const variantName =
                                        getVariantName(item);

                                    return (
                                        <div
                                            key={`${item.productId}-${index}`}
                                            className="group py-7 border-b border-black/10"
                                        >

                                            <div className="grid grid-cols-[110px_1fr_auto] md:grid-cols-[145px_1fr_auto] gap-5 md:gap-7 items-start">


                                                {/* PRODUCT IMAGE */}

                                                <div className="w-[110px] h-[135px] md:w-[145px] md:h-[175px] bg-[#ecece8] overflow-hidden">

                                                    {image ? (

                                                        <img
                                                            src={image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                        />

                                                    ) : (

                                                        <div className="w-full h-full flex items-center justify-center text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                                                            SNITCH
                                                        </div>

                                                    )}

                                                </div>


                                                {/* PRODUCT INFO */}

                                                <div className="min-w-0 flex flex-col justify-between min-h-[135px] md:min-h-[175px]">

                                                    <div>

                                                        <h3 className="text-[15px] md:text-[17px] font-medium tracking-[-0.02em]">
                                                            {item.title}
                                                        </h3>

                                                        {variantName && (
                                                            <p className="mt-2 text-[12px] text-neutral-500">
                                                                {variantName}
                                                            </p>
                                                        )}

                                                    </div>


                                                    <div className="flex flex-wrap gap-x-6 gap-y-2">

                                                        {item.size && (
                                                            <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                                                                Size{" "}
                                                                <span className="text-neutral-700">
                                                                    {item.size}
                                                                </span>
                                                            </span>
                                                        )}

                                                        <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                                                            Qty{" "}
                                                            <span className="text-neutral-700">
                                                                {item.quantity}
                                                            </span>
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* PRICE */}

                                                <div className="text-right">

                                                    <p className="text-[13px] md:text-[14px] font-medium">
                                                        {formatPrice(
                                                            item.price?.amount ||
                                                                0
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>


                        {/* ───────── PAYMENT SUMMARY ───────── */}

                        <aside>

                            <div className="border border-black/10 bg-white">

                                <div className="px-7 py-6 border-b border-black/10">

                                    <p className="text-[9px] tracking-[0.25em] uppercase text-neutral-400">
                                        Payment Summary
                                    </p>

                                </div>


                                <div className="px-7 py-7">

                                    <div className="flex justify-between items-center text-[13px]">

                                        <span className="text-neutral-500">
                                            Subtotal
                                        </span>

                                        <span>
                                            {formatPrice(totalAmount)}
                                        </span>

                                    </div>


                                    <div className="flex justify-between items-center mt-5 text-[13px]">

                                        <span className="text-neutral-500">
                                            Shipping
                                        </span>

                                        <span className="text-[10px] tracking-[0.18em] uppercase">
                                            Free
                                        </span>

                                    </div>


                                    <div className="border-t border-black/10 mt-7 pt-7 flex items-end justify-between">

                                        <span className="text-[10px] tracking-[0.2em] uppercase">
                                            Total
                                        </span>

                                        <span className="text-[25px] tracking-[-0.035em] font-medium">
                                            {formatPrice(totalAmount)}
                                        </span>

                                    </div>

                                    <p className="text-right mt-2 text-[8px] tracking-[0.18em] uppercase text-neutral-400">
                                        Inclusive of taxes
                                    </p>

                                </div>


                                {/* PAYMENT CONFIRMED */}

                                <div className="px-7 py-6 border-t border-black/10">

                                    <div className="flex items-center gap-4">

                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[11px]">
                                            ✓
                                        </div>

                                        <div>

                                            <p className="text-[11px] font-medium">
                                                Payment successful
                                            </p>

                                            <p className="text-[9px] text-neutral-400 mt-1">
                                                Your transaction is secure.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* PAYMENT ID */}

                            {payment?.razorpay?.paymentId && (

                                <p className="mt-4 text-[8px] tracking-[0.08em] text-neutral-400 break-all">
                                    PAYMENT ID ·{" "}
                                    {payment.razorpay.paymentId}
                                </p>

                            )}

                        </aside>

                    </div>

                </section>


                {/*FOOTER ACTIONS */}

                <section className="border-t border-black/10 py-10 md:py-12">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                        <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-400">
                            Thank you for choosing SNITCH
                        </p>


                        <div className="flex flex-col sm:flex-row gap-3">

                            <Link
                                to="/orders"
                                className="h-12 px-8 border border-black/10 flex items-center justify-center text-[9px] tracking-[0.22em] uppercase hover:border-black transition"
                            >
                                View Orders
                            </Link>

                            <Link
                                to="/"
                                className="h-12 px-8 bg-black text-white flex items-center justify-center text-[9px] tracking-[0.22em] uppercase hover:bg-neutral-800 transition"
                            >
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                </section>

            </main>


            {/*FOOTER */}

            <footer className="border-t border-black/10">

                <div className="max-w-[1180px] mx-auto px-6 md:px-8 py-7 flex items-center justify-between">

                    <span className="text-[10px] tracking-[0.2em] font-medium">
                        SNITCH
                    </span>

                    <span className="text-[8px] tracking-[0.2em] uppercase text-neutral-400">
                        Designed for the modern wardrobe
                    </span>

                </div>

            </footer>

        </div>
    );
};

export default OrderSuccess;