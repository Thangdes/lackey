"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
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
        // { name: "Mastercard", src: "/logo/payment/mastercard.svg" },
        // { name: "JCB", src: "/logo/payment/jcb.svg" },
        { name: "VNPAY", src: "/logo/payment/vnpay.svg" },
        { name: "MoMo", src: "/logo/payment/momo.svg" },
        // { name: "ZaloPay", src: "/logo/payment/zalopay.svg" },
        { name: "ATM nội địa", src: "/logo/payment/atm.svg" },
        { name: "Tiền mặt", src: "/logo/payment/cash.svg" },
    ];

    return (
        <footer className="bg-black text-white w-full relative overflow-x-hidden">
            <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold mb-4 tracking-wide">ĐĂNG KÝ NHẬN ƯU ĐÃI</h3>
                        <p className="text-sm text-gray-300 mb-4 max-w-xl mx-auto md:mx-0">
                            Trở thành người đầu tiên biết về các sản phẩm mới, ưu đãi đặc biệt và nhiều hơn nữa!
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mb-4 max-w-xl mx-auto md:mx-0">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-4 py-2.5 bg-white border border-white/30 text-black placeholder:text-gray-400 focus:outline-none focus:border-white transition-colors w-full"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-black text-white border-2 border-white font-semibold rounded hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
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
                        {/* <Link
                            href="http://online.gov.vn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Đã thông báo Bộ Công Thương"
                            className="mt-4 inline-block"
                        >
                            <img
                                src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png"
                                alt="Đã thông báo Bộ Công Thương"
                                className="h-10 w-auto md:h-12"
                            />
                        </Link>
                        <img
                            src="https://theme.hstatic.net/200000472237/1001083717/14/logo.png?v=881"
                            alt="Logo đối tác"
                            className="h-8 w-auto md:h-10 mt-2"
                        /> */}
                    </div>
                </div>

                <div className="mt-12 pt-8 relative">
                    <h3 className="text-lg font-bold mb-4 tracking-wide text-center md:text-left">KẾT NỐI</h3>
                    <div className="flex gap-4 justify-center md:justify-start">
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
                    </div>
                    <div className="relative z-10 flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                        {PAYMENT_METHODS.map((method) => (
                            <div
                                key={method.name}
                                className="h-8 px-2 bg-white rounded flex items-center justify-center"
                                title={method.name}
                            >
                                <Image
                                    src={method.src}
                                    alt={method.name}
                                    width={40}
                                    height={24}
                                    className="object-contain h-6 w-auto"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-[11px] md:text-xs text-gray-400 max-w-2xl text-center md:text-left mx-auto md:mx-0">
                        Website học tập phục vụ đồ án của trường. <br/> Dự án học tập, chưa thực hiện thông báo Bộ Công Thương.
                    </p>
                </div>
            </div>

            <div className="">
                <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6">
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-400 text-center md:text-left">
                        <span> 2025, LắcKey</span>
                        <Link href={ROUTES.home} className="hover:text-white">Powered by <span className="font-bold underline">Annamite Labs</span></Link>
                        <Link href={ROUTES.return} className="hover:text-white">Chính sách đổi trả</Link>
                        <Link href={ROUTES.privacy} className="hover:text-white">Chính sách bảo mật</Link>
                        <Link href={ROUTES.terms} className="hover:text-white">Điều khoản dịch vụ</Link>
                        <Link href={ROUTES.shipping} className="hover:text-white">Chính sách vận chuyển</Link>
                        <Link href={ROUTES.contact} className="hover:text-white">Thông tin liên hệ</Link>
                        <Link href="#" className="hover:text-white">Chính sách hủy bỏ</Link>
                    </div>
                </div>

                <div className="hidden md:flex absolute bottom-0 right-0 pointer-events-none select-none justify-center">
                    <div className="flex flex-col">
                        <span className="font-[family-name:var(--font-retro)] text-[10px] sm:text-xs md:text-sm text-white tracking-wide mb-2 md:mb-3">Take My Energy</span>
                        <Image
                            src="/keychain-mascot.png"
                            alt="Mascot"
                            width={200}
                            height={300}
                            className="object-contain w-auto h-[160px] md:h-[200px] lg:h-[220px] xl:h-[240px]"
                        />
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;