"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { FaSnapchat } from "react-icons/fa";
import { Bell } from "lucide-react";
import { ROUTES } from "@/constant/route";
import { showSuccessToast, showErrorToast } from "@/components/toast/AppToast";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showErrorToast({ title: "Lỗi", message: "Vui lòng nhập email hợp lệ" });
            return;
        }
        setLoading(true);
        try {
            // TODO: Integrate with newsletter API
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccessToast({ title: "Thành công", message: "Đăng ký thành công! Cảm ơn bạn đã theo dõi." });
            setEmail("");
        } catch {
            showErrorToast({ title: "Lỗi", message: "Có lỗi xảy ra. Vui lòng thử lại." });
        } finally {
            setLoading(false);
        }
    };

    const SUPPORT_LINKS = [
        { label: "Danh mục sản phẩm", href: ROUTES.categories },
        { label: "FAQs", href: ROUTES.help },
        { label: "Hướng dẫn chọn size", href: ROUTES.help },
        { label: "Tra cứu đơn hàng", href: ROUTES.ordersLookup },
        { label: "Tài khoản", href: ROUTES.profile },
        { label: "Đổi trả hàng", href: ROUTES.return },
        { label: "Liên hệ", href: ROUTES.contact },
    ];

    const COMPANY_LINKS = [
        { label: "Đánh giá", href: ROUTES.about },
        { label: "Chính sách bảo mật", href: ROUTES.privacy },
        { label: "Điều khoản sử dụng", href: ROUTES.terms },
        { label: "Chính sách đại lý", href: ROUTES.about },
    ];

    const PAYMENT_METHODS = [
        { name: "Visa", src: "/logo/payment/visa.svg" },
        { name: "Mastercard", src: "/logo/payment/mastercard.svg" },
        { name: "JCB", src: "/logo/payment/jcb.svg" },
        { name: "VNPAY", src: "/logo/payment/vnpay.svg" },
        { name: "MoMo", src: "/logo/payment/momo.svg" },
        { name: "ZaloPay", src: "/logo/payment/zalopay.svg" },
        { name: "ATM nội địa", src: "/logo/payment/atm.svg" },
        { name: "Tiền mặt", src: "/logo/payment/cash.svg" },
    ];

    return (
        <footer className="bg-black text-white w-full">
            <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div>
                        <h3 className="text-lg font-bold mb-4 tracking-wide">ĐĂNG KÝ NHẬN ƯU ĐÃI</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Trở thành người đầu tiên biết về các sản phẩm mới, ưu đãi đặc biệt và nhiều hơn nữa!
                        </p>
                        <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-4 py-2.5 bg-white border border-white/30 text-black placeholder:text-gray-400 focus:outline-none focus:border-white transition-colors"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-black text-white border-2 border-white font-semibold rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "..." : "GỬI NGAY"}
                            </button>
                        </form>
                        <Link href={ROUTES.privacy} className="text-xs text-gray-400 hover:text-white underline">
                            Chính sách bảo mật
                        </Link>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 tracking-wide">HỖ TRỢ</h3>
                        <ul className="space-y-2.5">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 tracking-wide">CÔNG TY</h3>
                        <ul className="space-y-2.5">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 relative">
                    <h3 className="text-lg font-bold mb-4 tracking-wide">KẾT NỐI</h3>
                    <div className="flex gap-4">
                        <Link href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <SiFacebook className="w-5 h-5" />
                        </Link>
                        <Link href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <SiInstagram className="w-5 h-5" />
                        </Link>
                        <Link href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <SiYoutube className="w-5 h-5" />
                        </Link>
                        <Link href="#" aria-label="TikTok" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <SiTiktok className="w-5 h-5" />
                        </Link>
                        <Link href="#" aria-label="Snapchat" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <FaSnapchat className="w-5 h-5" />
                        </Link>
                        <Link href="#" aria-label="Notifications" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <Bell className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                        {PAYMENT_METHODS.map((method) => (
                            <div
                                key={method.name}
                                className="h-8 px-2 bg-white rounded flex items-center justify-center"
                                title={method.name}
                            >
                                <Image
                                    src={method.src}
                                    alt={method.name}
                                    width={48}
                                    height={32}
                                    className="object-contain h-6 w-auto"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-400">
                        <span>© 2025, LắcKey</span>
                        <Link href="https://shopify.com" className="hover:text-white">Powered by Lackey</Link>
                        <Link href={ROUTES.return} className="hover:text-white">Chính sách đổi trả</Link>
                        <Link href={ROUTES.privacy} className="hover:text-white">Chính sách bảo mật</Link>
                        <Link href={ROUTES.terms} className="hover:text-white">Điều khoản dịch vụ</Link>
                        <Link href={ROUTES.shipping} className="hover:text-white">Chính sách vận chuyển</Link>
                        <Link href={ROUTES.contact} className="hover:text-white">Thông tin liên hệ</Link>
                        <Link href="#" className="hover:text-white">Chính sách hủy bỏ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;