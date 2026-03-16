"use client";

import Link from "next/link";

export default function CheckoutFooter() {
  const links = [
    { label: "Refund policy", href: "/refund-policy" },
    { label: "Shipping", href: "/shipping" },
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms of service", href: "/terms-of-service" },
    { label: "Cancellations", href: "/cancellations" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
