import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "@/config/seo";
import { siteConfig } from "@/constant/site";
import LayoutChrome from "@/components/layout/LayoutChrome";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthModal from "@/components/auth/AuthModal";
import { GoogleAnalytics } from '@next/third-parties/google'
import CartBootstrap from "@/components/providers/CartBootstrap";
import TopProgress from "@/components/progress/TopProgress";
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: siteConfig.logo,
              sameAs: siteConfig.sameAs?.filter(Boolean),
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: siteConfig.contact.telephoneE164,
                  email: siteConfig.contact.email,
                  contactType: "customer service",
                  availableLanguage: ["vi"],
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteConfig.url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F3F5F8]`}
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
              <CartBootstrap />
              <Toaster richColors position="top-right" duration={3000}/>
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
