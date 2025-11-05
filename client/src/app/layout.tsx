import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { defaultMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd, buildSiteNavigationJsonLd } from "@/config/seo";
import LayoutChrome from "@/components/layout/LayoutChrome";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthModal from "@/components/auth/AuthModal";
import { GoogleAnalytics } from '@next/third-parties/google'
import CartBootstrap from "@/components/providers/CartBootstrap";
import TopProgress from "@/components/progress/TopProgress";
import ChristmasPopup from "@/components/seasonal/ChristmasPopup";
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fcRodancy = localFont({
  src: "../font/FC-Rodancy.otf",
  variable: "--font-retro",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <meta name="theme-color" content="#229090" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <Script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd()) }}
      />
      <Script
        id="ld-site-navigation"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSiteNavigationJsonLd()) }}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fcRodancy.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <TopProgress />
        </Suspense>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <LayoutChrome>
                {children}
                <GoogleAnalytics gaId="G-CL7D21ZY78" />
              </LayoutChrome>
              <AuthModal />
              <ChristmasPopup />
              <CartBootstrap />
              <Toaster richColors position="top-right" duration={3000}/>
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
