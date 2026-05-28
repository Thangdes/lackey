"use client";

import Image from "next/image";
import { STORY_BADGE, STORY_HEADING, STORY_PARAGRAPHS, STORY_SUGGESTIONS } from "@/constant/story";
import { siteConfig } from "@/constant/site";
import { BadgePercent, Phone } from "lucide-react";

const Story = () => {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-[--color-peach-cream-100] text-black mt-14 md:mt-20"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/images/middle/stars-bg.webp"
          alt="Mid-Autumn starry sky"
          fill
          priority
          className="object-cover opacity-70"
        />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-20 md:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
          <span>{STORY_BADGE.left}</span>
          <span className="h-1 w-1 rounded-full bg-white/60" />
          <span>{STORY_BADGE.right}</span>
        </div>

        <h2 className="text-balance text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
          {STORY_HEADING}
        </h2>
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
          <div className="space-y-5">
            <p>{STORY_PARAGRAPHS[0]}</p>
            <p>{STORY_PARAGRAPHS[1]}</p>

            <div className="mt-6 rounded-xl bg-white/60 p-4 shadow-sm backdrop-blur">
              <h3 className="text-base font-semibold">🥮 Gợi ý vị Trung Thu</h3>
              <ul className="mt-2 grid grid-cols-1 gap-2 text-sm leading-relaxed md:grid-cols-2">
                <li className="flex gap-2"><span className="select-none">•</span>{STORY_SUGGESTIONS[0]}</li>
                <li className="flex gap-2"><span className="select-none">•</span>{STORY_SUGGESTIONS[1]}</li>
                <li className="flex gap-2"><span className="select-none">•</span>{STORY_SUGGESTIONS[2]}</li>
                <li className="flex gap-2"><span className="select-none">•</span>{STORY_SUGGESTIONS[3]}</li>
              </ul>
            </div>

            {}
            <div className="mt-4 rounded-xl border border-black/10 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-sm text-black/80 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <BadgePercent size={18} className="text-amber-700" aria-hidden />
                  <span>Mua sỉ – nhận chiết khấu hấp dẫn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-amber-700" aria-hidden />
                  <a href={`tel:${siteConfig.contact.telephoneE164}`} className="font-semibold text-amber-700 hover:underline">
                    {siteConfig.contact.telephone}
                  </a>
                  <span className="ml-1 hidden md:inline text-black/60">(Liên hệ để báo giá chi tiết)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <div
              aria-hidden
              className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-yellow-200/80 blur-md shadow-[0_0_40px_rgba(255,225,150,0.7)]"
            />

            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/middle/cake.webp"
                  alt="Bánh Trung Thu"
                  fill
                  className="object-contain animate-fade-up"
                />
              </div>
              <div className="hidden md:block pointer-events-none absolute -bottom-10 -left-8 w-40 select-none md:-left-12 md:w-48">
                <Image
                  src="/images/middle/rabbit.png"
                  alt="Thỏ ngọc"
                  width={220}
                  height={220}
                  className="animate-bounce-slow drop-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10">
        <Image
          src="/images/middle/yellow-wave.webp"
          alt="wave"
          width={1600}
          height={300}
          className="w-full object-cover opacity-70"
        />
      </div>
    </section>
  );
};

export default Story;