"use client";
import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header/Header";
import Footer from "./Footer/Footer";

// Dynamic import ChatWidget to prevent hydration mismatch
const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), {
  ssr: false,
});

const LayoutChrome: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isSupplier = pathname?.startsWith("/supplier");


  if (isAdmin || isSupplier) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="">{children}</div>
      {/* <ChatWidget /> */}
      {/* <Footer /> */}
    </>
  );
};

export default LayoutChrome;
