"use client";

import React from "react";
import type { ProductVariant } from "@/type/product";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { FiMail, FiPhone } from "react-icons/fi";

export type ProductTabsProps = {
  tab: "desc" | "reviews" | "info" | "supplier";
  onChange: (t: "desc" | "reviews" | "info" | "supplier") => void;
  description?: string | null;
  ratingValue: number;
  ratingCount: number;
  variants: ProductVariant[];
  supplier?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    description?: string | null; // HTML content
  };
  displayMode?: "tabs" | "stacked" | "auto"; // auto = stacked on mobile/tablet, tabs on desktop
};

const ProductTabs: React.FC<ProductTabsProps> = ({ tab, onChange, description, ratingValue, ratingCount, variants, supplier, displayMode = "tabs" }) => {
  return (
    <div className="pt-2 md:pt-3">
      {displayMode === "auto" ? (
        // Auto mode: Stacked on small screens, Tabs on lg+
        <>
          {/* Tabs header visible on lg+ */}
          <div role="tablist" className="hidden lg:flex items-center gap-3 border-b">
            <button
              role="tab"
              aria-selected={tab === "desc"}
              onClick={() => onChange("desc")}
              className={`px-1.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === "desc" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Mô tả
            </button>
            <button
              role="tab"
              aria-selected={tab === "reviews"}
              onClick={() => onChange("reviews")}
              className={`px-1.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === "reviews" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Đánh giá ({ratingCount})
            </button>
            <button
              role="tab"
              aria-selected={tab === "info"}
              onClick={() => onChange("info")}
              className={`px-1.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === "info" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Thông tin bổ sung
            </button>
            {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <button
                role="tab"
                aria-selected={tab === "supplier"}
                onClick={() => onChange("supplier")}
                className={`px-1.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === "supplier" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
              >
                Nhà cung cấp
              </button>
            ) : null}
          </div>
          {/* Tab panels for lg+ */}
          <div role="tabpanel" className="hidden lg:block pt-3">
            {tab === "desc" && (
              description ? (
                <div className="prose prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: description as string }} />
              ) : (
                <p className="text-sm text-neutral-600">Chưa có mô tả cho sản phẩm này.</p>
              )
            )}
            {tab === "reviews" && (
              <div className="text-sm text-neutral-700">
                <p className="mb-3">Tính năng đánh giá đang được cập nhật.</p>
                <p>
                  Điểm trung bình: <span className="font-medium">{ratingValue.toFixed(1)}/5</span> • {ratingCount} lượt đánh giá
                </p>
              </div>
            )}
            {tab === "info" && (
              <div className="text-sm text-neutral-700 space-y-2">
                {variants.length > 0 ? (
                  <div>
                    <div className="font-medium mb-1.5">Phiên bản khả dụng</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {variants.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2">
                          <span>{v.name}</span>
                          <span className="text-neutral-500">SKU: {v.sku}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">Chưa có thông tin bổ sung.</p>
                )}
              </div>
            )}
            {tab === "supplier" && (
              supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
                <div className="text-sm text-neutral-700">
                  {supplier.description ? (
                    <div className="prose prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: supplier.description as string }} />
                  ) : null}
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {supplier.name ? (
                      <div><span className="text-neutral-500">Tên:</span> <span className="font-medium">{supplier.name}</span></div>
                    ) : null}
                    {supplier.email ? (
                      <div><span className="text-neutral-500">Email:</span> <a href={`mailto:${supplier.email}`} className="underline hover:no-underline">{supplier.email}</a></div>
                    ) : null}
                    {supplier.phone ? (
                      <div><span className="text-neutral-500">Điện thoại:</span> <a href={`tel:${supplier.phone}`} className="underline hover:no-underline">{supplier.phone}</a></div>
                    ) : null}
                    {supplier.address ? (
                      <div className="md:col-span-2"><span className="text-neutral-500">Địa chỉ:</span> <span>{supplier.address}</span></div>
                    ) : null}
                  </div>
                  {supplier.id ? (
                    <div className="mt-2">
                      <Link href={{ pathname: ROUTES.products, query: { supplierId: supplier.id } }} className="text-sm font-medium text-[var(--color-cod-gray-900)] hover:underline">
                        Xem tất cả sản phẩm từ nhà cung cấp này
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">Chưa có thông tin nhà cung cấp.</p>
              )
            )}
          </div>
          {/* Stacked content for small screens */}
          <div className="lg:hidden space-y-7 md:space-y-8 pt-2.5">
            <section>
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-cod-gray-900)] mb-2">Mô tả</h3>
              {description ? (
                <div className="prose prose-xs md:prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: description as string }} />
              ) : (
                <p className="text-[13px] md:text-sm text-neutral-600">Chưa có mô tả cho sản phẩm này.</p>
              )}
            </section>
            <section>
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-cod-gray-900)] mb-2">Nhà cung cấp</h3>
              {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
                <div className="text-[13px] md:text-sm text-neutral-700">
                  {supplier.description ? (
                    <div className="prose prose-xs md:prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: supplier.description as string }} />
                  ) : null}
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
                    {supplier.name ? (
                      <div><span className="text-neutral-500">Tên:</span> <span className="font-medium">{supplier.name}</span></div>
                    ) : null}
                    {supplier.email ? (
                      <div className="inline-flex items-center gap-1"><span className="text-neutral-500">Email:</span> <FiMail className="h-4 w-4 text-neutral-500" aria-hidden /><a href={`mailto:${supplier.email}`} className="underline hover:no-underline">{supplier.email}</a></div>
                    ) : null}
                    {supplier.phone ? (
                      <div className="inline-flex items-center gap-1"><span className="text-neutral-500">Điện thoại:</span> <FiPhone className="h-4 w-4 text-neutral-500" aria-hidden /><a href={`tel:${supplier.phone}`} className="underline hover:no-underline">{supplier.phone}</a></div>
                    ) : null}
                    {supplier.address ? (
                      <div className="md:col-span-2"><span className="text-neutral-500">Địa chỉ:</span> <span>{supplier.address}</span></div>
                    ) : null}
                  </div>
                  {supplier.id ? (
                    <div className="mt-2">
                      <Link href={{ pathname: ROUTES.products, query: { supplierId: supplier.id } }} className="text-[12px] md:text-sm font-medium text-[var(--color-cod-gray-900)] hover:underline">
                        Xem tất cả sản phẩm từ nhà cung cấp này
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-[13px] md:text-sm text-neutral-600">Chưa có thông tin nhà cung cấp.</p>
              )}
            </section>
            <section>
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-cod-gray-900)] mb-2">Thông tin bổ sung</h3>
              <div className="text-[13px] md:text-sm text-neutral-700 space-y-1.5 md:space-y-2">
                {variants.length > 0 ? (
                  <div>
                    <ul className="list-disc pl-5 space-y-1">
                      {variants.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2">
                          <span>{v.name}</span>
                          <span className="text-neutral-500">SKU: {v.sku}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-[13px] md:text-sm text-neutral-600">Chưa có thông tin bổ sung.</p>
                )}
              </div>
            </section>
            <section>
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-cod-gray-900)] mb-2">Đánh giá</h3>
              <div className="text-[13px] md:text-sm text-neutral-700">
                <p className="mb-2 md:mb-3">Tính năng đánh giá đang được cập nhật.</p>
                <p>
                  Điểm trung bình: <span className="font-medium">{ratingValue.toFixed(1)}/5</span> • {ratingCount} lượt đánh giá
                </p>
              </div>
            </section>
          </div>
        </>
      ) : displayMode === "tabs" ? (
        <>
          <div role="tablist" className="flex items-center gap-2.5 md:gap-3 border-b">
            <button
              role="tab"
              aria-selected={tab === "desc"}
              onClick={() => onChange("desc")}
              className={`px-1 py-2 md:px-1.5 text-[13px] md:text-sm font-medium -mb-px border-b-2 ${tab === "desc" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Mô tả
            </button>
            <button
              role="tab"
              aria-selected={tab === "reviews"}
              onClick={() => onChange("reviews")}
              className={`px-1 py-2 md:px-1.5 text-[13px] md:text-sm font-medium -mb-px border-b-2 ${tab === "reviews" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Đánh giá ({ratingCount})
            </button>
            <button
              role="tab"
              aria-selected={tab === "info"}
              onClick={() => onChange("info")}
              className={`px-1 py-2 md:px-1.5 text-[13px] md:text-sm font-medium -mb-px border-b-2 ${tab === "info" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
            >
              Thông tin bổ sung
            </button>
            {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <button
                role="tab"
                aria-selected={tab === "supplier"}
                onClick={() => onChange("supplier")}
                className={`px-1 py-2 md:px-1.5 text-[13px] md:text-sm font-medium -mb-px border-b-2 ${tab === "supplier" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
              >
                Nhà cung cấp
              </button>
            ) : null}
          </div>
          <div role="tabpanel" className="pt-2.5 md:pt-3">
            {tab === "desc" && (
              description ? (
                <div className="prose prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: description as string }} />
              ) : (
                <p className="text-sm md:text-base text-neutral-600">Chưa có mô tả cho sản phẩm này.</p>
              )
            )}
            {tab === "reviews" && (
              <div className="text-sm md:text-base text-neutral-700">
                <p className="mb-2.5 md:mb-3">Tính năng đánh giá đang được cập nhật.</p>
                <p>
                  Điểm trung bình: <span className="font-medium">{ratingValue.toFixed(1)}/5</span> • {ratingCount} lượt đánh giá
                </p>
              </div>
            )}
            {tab === "info" && (
              <div className="text-sm md:text-base text-neutral-700 space-y-2 md:space-y-2.5">
                {variants.length > 0 ? (
                  <div>
                    <div className="font-medium mb-1.5 md:mb-2">Phiên bản khả dụng</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {variants.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2">
                          <span>{v.name}</span>
                          <span className="text-neutral-500">SKU: {v.sku}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-neutral-600">Chưa có thông tin bổ sung.</p>
                )}
              </div>
            )}
            {tab === "supplier" && (
              supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
                <div className="text-sm md:text-base text-neutral-700">
                  {supplier.description ? (
                    <div className="prose prose-sm md:prose-base max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: supplier.description as string }} />
                  ) : null}
                  <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2.5">
                    {supplier.name ? (
                      <div><span className="text-neutral-500">Tên:</span> <span className="font-medium">{supplier.name}</span></div>
                    ) : null}
                    {supplier.email ? (
                      <div><span className="text-neutral-500">Email:</span> <a href={`mailto:${supplier.email}`} className="underline hover:no-underline">{supplier.email}</a></div>
                    ) : null}
                    {supplier.phone ? (
                      <div><span className="text-neutral-500">Điện thoại:</span> <a href={`tel:${supplier.phone}`} className="underline hover:no-underline">{supplier.phone}</a></div>
                    ) : null}
                    {supplier.address ? (
                      <div className="md:col-span-2"><span className="text-neutral-500">Địa chỉ:</span> <span>{supplier.address}</span></div>
                    ) : null}
                  </div>
                  {supplier.id ? (
                    <div className="mt-2">
                      <Link href={{ pathname: ROUTES.products, query: { supplierId: supplier.id } }} className="text-sm md:text-base font-medium text-[var(--color-cod-gray-900)] hover:underline">
                        Xem tất cả sản phẩm từ nhà cung cấp này
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm md:text-base text-neutral-600">Chưa có thông tin nhà cung cấp.</p>
              )
            )}
          </div>
        </>
      ) : (
        // Stacked mode: show all sections without tabs - RETRO MINIMAL STYLE
        <div className="space-y-6">
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-4 pb-3 border-b-4 border-black">Mô tả</h3>
            {description ? (
              <div className="prose prose-sm md:prose-base max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: description as string }} />
            ) : (
              <p className="text-sm text-neutral-600">Chưa có mô tả cho sản phẩm này.</p>
            )}
          </section>
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-4 pb-3 border-b-4 border-black">Nhà cung cấp</h3>
            {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <div className="text-sm text-neutral-700">
                {supplier.description ? (
                  <div className="prose prose-sm max-w-none text-neutral-800 mb-4" dangerouslySetInnerHTML={{ __html: supplier.description as string }} />
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplier.name ? (
                    <div className="p-3 bg-neutral-50 border-2 border-neutral-300"><span className="text-neutral-600 font-bold">Tên:</span> <span className="font-medium">{supplier.name}</span></div>
                  ) : null}
                  {supplier.email ? (
                    <div className="p-3 bg-neutral-50 border-2 border-neutral-300 flex items-center gap-2"><FiMail className="h-4 w-4 text-neutral-600" /><span className="text-neutral-600 font-bold">Email:</span> <a href={`mailto:${supplier.email}`} className="font-bold hover:text-[var(--brand-secondary)] transition-colors">{supplier.email}</a></div>
                  ) : null}
                  {supplier.phone ? (
                    <div className="p-3 bg-neutral-50 border-2 border-neutral-300 flex items-center gap-2"><FiPhone className="h-4 w-4 text-neutral-600" /><span className="text-neutral-600 font-bold">Phone:</span> <a href={`tel:${supplier.phone}`} className="font-bold hover:text-[var(--brand-secondary)] transition-colors">{supplier.phone}</a></div>
                  ) : null}
                  {supplier.address ? (
                    <div className="md:col-span-2 p-3 bg-neutral-50 border-2 border-neutral-300"><span className="text-neutral-600 font-bold">Địa chỉ:</span> <span>{supplier.address}</span></div>
                  ) : null}
                </div>
                {supplier.id ? (
                  <div className="mt-4">
                    <Link href={{ pathname: ROUTES.products, query: { supplierId: supplier.id } }} className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black font-bold uppercase text-xs hover:bg-white hover:text-black transition-all">
                      Xem tất cả sản phẩm →
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">Chưa có thông tin nhà cung cấp.</p>
            )}
          </section>
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-4 pb-3 border-b-4 border-black">Thông tin bổ sung</h3>
            <div className="text-sm text-neutral-700">
              {variants.length > 0 ? (
                <div className="space-y-2">
                  {variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-4 p-3 bg-neutral-50 border-2 border-neutral-300">
                      <span className="font-bold">{v.name}</span>
                      <span className="text-xs px-2 py-1 bg-white border border-black font-bold">SKU: {v.sku}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">Chưa có thông tin bổ sung.</p>
              )}
            </div>
          </section>
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-4 pb-3 border-b-4 border-black">Đánh giá</h3>
            <div className="text-sm text-neutral-700">
              <div className="p-4 bg-neutral-50 border-2 border-neutral-300 mb-3">
                <p className="font-medium">Tính năng đánh giá đang được cập nhật.</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#fff100] border-2 border-black">
                <div className="text-3xl font-bold text-black">{ratingValue.toFixed(1)}</div>
                <div>
                  <div className="text-xs text-black uppercase font-bold">Điểm trung bình</div>
                  <div className="text-xs text-neutral-700">{ratingCount} lượt đánh giá</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
;

export default ProductTabs;
