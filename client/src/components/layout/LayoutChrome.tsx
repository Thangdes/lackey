"use client";
import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header/Header";
import Footer from "./Footer/Footer";

const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
});

const LayoutChrome: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isSupplier = pathname?.startsWith("/supplier");
  const isCheckout = pathname?.startsWith("/checkout");


  if (isAdmin || isSupplier || isCheckout) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <ChatWidget />
      <Footer />
    </>
  );
};

export default LayoutChrome;
