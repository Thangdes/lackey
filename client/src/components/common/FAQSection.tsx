"use client";

import Script from "next/script";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { buildFAQJsonLd } from "@/config/seo";

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQSectionProps = {
  faqs: FAQItem[];
  title?: string;
  includeJsonLd?: boolean;
};

export default function FAQSection({ 
  faqs, 
  title = "Câu hỏi thường gặp",
  includeJsonLd = true 
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = buildFAQJsonLd(faqs);

  return (
    <>
      {includeJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-black bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-bold text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 border-t-2 border-black pt-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
