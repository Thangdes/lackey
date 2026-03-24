"use client";

import React from "react";
import type { ProductVariant } from "@/type/product";


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
  displayMode?: "tabs" | "stacked" | "auto";
};

const ProductTabs: React.FC<ProductTabsProps> = ({ tab, onChange, description, ratingValue, ratingCount, variants, displayMode = "tabs" }) => {
  return (
    <div className="pt-2 md:pt-3">
      {displayMode === "auto" ? (
        <>
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
            {/* Temporarily hidden - Supplier tab */}
            {/* {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <button
                role="tab"
                aria-selected={tab === "supplier"}
                onClick={() => onChange("supplier")}
                className={`px-1.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === "supplier" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
              >
                Nhà cung cấp
              </button>
            ) : null} */}
          </div>
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
            {/* Temporarily hidden - Supplier content */}
            {/* {tab === "supplier" && (
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
            )} */}
          </div>
          <div className="lg:hidden space-y-7 md:space-y-8 pt-2.5">
            <section>
              <h3 className="text-base md:text-lg font-semibold text-[var(--color-cod-gray-900)] mb-2">Mô tả</h3>
              {description ? (
                <div className="prose prose-xs md:prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{ __html: description as string }} />
              ) : (
                <p className="text-[13px] md:text-sm text-neutral-600">Chưa có mô tả cho sản phẩm này.</p>
              )}
            </section>
            {/* Temporarily hidden - Supplier section in mobile stacked view */}
            {/* <section>
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
            </section> */}
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
            {/* Temporarily hidden - Supplier tab */}
            {/* {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <button
                role="tab"
                aria-selected={tab === "supplier"}
                onClick={() => onChange("supplier")}
                className={`px-1 py-2 md:px-1.5 text-[13px] md:text-sm font-medium -mb-px border-b-2 ${tab === "supplier" ? "border-[var(--color-cod-gray-900)] text-[var(--color-cod-gray-900)]" : "border-transparent text-neutral-600 hover:text-neutral-800"}`}
              >
                Nhà cung cấp
              </button>
            ) : null} */}
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
            {/* Temporarily hidden - Supplier content */}
            {/* {tab === "supplier" && (
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
            )} */}
          </div>
        </>
      ) : (
        // Stacked mode: show all sections without tabs - MINIMAL MODERN STYLE
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Mô tả</h3>
            {description ? (
              <div className="prose prose-sm md:prose-base max-w-none text-neutral-700" dangerouslySetInnerHTML={{ __html: description as string }} />
            ) : (
              <p className="text-sm text-neutral-500">Chưa có mô tả cho sản phẩm này.</p>
            )}
          </section>

          {/* Temporarily hidden - Supplier section in stacked view */}
          {/* <section className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Nhà cung cấp</h3>
            {supplier && (supplier.name || supplier.description || supplier.email || supplier.phone || supplier.address) ? (
              <div className="text-sm text-neutral-700">
                {supplier.description ? (
                  <div className="prose prose-sm max-w-none text-neutral-700 mb-4" dangerouslySetInnerHTML={{ __html: supplier.description as string }} />
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supplier.name ? (
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500 text-xs font-medium">Tên</span>
                      <p className="font-medium text-neutral-900 mt-1">{supplier.name}</p>
                    </div>
                  ) : null}
                  {supplier.email ? (
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500 text-xs font-medium flex items-center gap-1.5">
                        <FiMail className="h-3.5 w-3.5" />
                        Email
                      </span>
                      <a href={`mailto:${supplier.email}`} className="font-medium text-neutral-900 hover:text-neutral-700 mt-1 block">{supplier.email}</a>
                    </div>
                  ) : null}
                  {supplier.phone ? (
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500 text-xs font-medium flex items-center gap-1.5">
                        <FiPhone className="h-3.5 w-3.5" />
                        Điện thoại
                      </span>
                      <a href={`tel:${supplier.phone}`} className="font-medium text-neutral-900 hover:text-neutral-700 mt-1 block">{supplier.phone}</a>
                    </div>
                  ) : null}
                  {supplier.address ? (
                    <div className="md:col-span-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-neutral-500 text-xs font-medium">Địa chỉ</span>
                      <p className="text-neutral-900 mt-1">{supplier.address}</p>
                    </div>
                  ) : null}
                </div>
                {supplier.id ? (
                  <div className="mt-4">
                    <Link 
                      href={{ pathname: ROUTES.products, query: { supplierId: supplier.id } }} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Xem tất cả sản phẩm →
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Chưa có thông tin nhà cung cấp.</p>
            )}
          </section> */}

          <section className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Thông tin bổ sung</h3>
            <div className="text-sm text-neutral-700">
              {variants.length > 0 ? (
                <div className="space-y-2">
                  {variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="font-medium text-neutral-900">{v.name}</span>
                      <span className="text-xs px-2.5 py-1 bg-white rounded-full border border-neutral-300 font-medium text-neutral-600">
                        SKU: {v.sku}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Chưa có thông tin bổ sung.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Đánh giá</h3>
            <div className="text-sm text-neutral-700">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 mb-3">
                <p className="font-medium text-neutral-700">Tính năng đánh giá đang được cập nhật.</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border border-amber-200">
                <div className="text-3xl font-bold text-neutral-900">{ratingValue.toFixed(1)}</div>
                <div>
                  <div className="text-xs text-neutral-600 font-semibold uppercase">Điểm trung bình</div>
                  <div className="text-xs text-neutral-500">{ratingCount} lượt đánh giá</div>
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
