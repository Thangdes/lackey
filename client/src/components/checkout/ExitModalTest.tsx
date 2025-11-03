"use client";

import React, { useState } from "react";
import { AlertTriangle, Eye } from "lucide-react";

export default function ExitModalTest() {
  const [showModal, setShowModal] = useState(false);
  const [exitContext, setExitContext] = useState<"normal" | "vietqr">("normal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-none border-3 border-black bg-[#fff100] mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Eye className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-[family-name:var(--font-retro)] text-5xl font-bold text-black mb-3 uppercase tracking-wider">
            EXIT MODAL TEST
          </h1>
          <p className="text-lg text-neutral-700 font-medium">
            Retro + Minimalist Design - Brutalist Style
          </p>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden mb-8">
          <div className="bg-[#2d2d2d] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-[#fff100] uppercase tracking-wider">
              ✨ Design Features
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Brutalist Borders</div>
                    <div className="text-sm text-neutral-600">Border-3 border-black everywhere</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">No Rounded Corners</div>
                    <div className="text-sm text-neutral-600">Rounded-none for sharp edges</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Retro Colors</div>
                    <div className="text-sm text-neutral-600">Yellow (#fff100) + Beige (#f5f1e8)</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Drop Shadow Effect</div>
                    <div className="text-sm text-neutral-600">Shadow [8px_8px_0px_0px]</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Interactive Buttons</div>
                    <div className="text-sm text-neutral-600">Shadow disappears on hover</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Retro Typography</div>
                    <div className="text-sm text-neutral-600">Uppercase + tracking-wider</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="bg-[#fff100] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-black uppercase tracking-wider">
              🎬 Preview Modals
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-bold text-black uppercase text-sm tracking-wider">Normal Exit</h3>
                <p className="text-sm text-neutral-600">
                  Form chưa lưu dữ liệu
                </p>
                <button
                  onClick={() => {
                    setExitContext("normal");
                    setShowModal(true);
                  }}
                  className="w-full rounded-none border-3 border-black bg-[#2d2d2d] text-[#fff100] px-6 py-3 font-bold uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  SHOW NORMAL EXIT
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-black uppercase text-sm tracking-wider">VietQR Exit</h3>
                <p className="text-sm text-neutral-600">
                  Có đơn hàng đang chờ thanh toán
                </p>
                <button
                  onClick={() => {
                    setExitContext("vietqr");
                    setShowModal(true);
                  }}
                  className="w-full rounded-none border-3 border-black bg-[#ff4444] text-white px-6 py-3 font-bold uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  SHOW VIETQR EXIT
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#fff100] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Retro Style</h3>
            <p className="text-xs text-black/80">
              Bright yellow, bold borders, no subtle effects
            </p>
          </div>
          <div className="bg-white rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Minimalist</h3>
            <p className="text-xs text-neutral-600">
              Clean layout, essential elements only
            </p>
          </div>
          <div className="bg-[#2d2d2d] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">🔲</div>
            <h3 className="font-bold text-[#fff100] mb-2 uppercase text-sm">Brutalist</h3>
            <p className="text-xs text-[#fff100]/80">
              Sharp edges, thick borders, hard shadows
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/60"
          onClick={(e) => { if (e.currentTarget === e.target) setShowModal(false); }}
        >
          <div className="flex min-h-[100dvh] items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-none border-3 border-black bg-[#f5f1e8] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 border-b-3 border-black bg-[#fff100] px-5 py-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-none border-2 border-black bg-black text-[#fff100]">
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </span>
                <div className="font-[family-name:var(--font-retro)] text-lg font-bold text-black uppercase tracking-wider">
                  {exitContext === 'vietqr' ? 'RỜI KHỎI THANH TOÁN?' : 'RỜI KHỎI TRANG?'}
                </div>
              </div>
              <div className="px-6 py-6">
                {exitContext === 'vietqr' ? (
                  <p className="text-base text-[#2d2d2d] leading-relaxed font-medium">
                    Bạn đang có một đơn hàng đang chờ (VietQR). Bạn có muốn hủy đơn hàng này trước khi rời trang?
                  </p>
                ) : (
                  <p className="text-base text-[#2d2d2d] leading-relaxed font-medium">
                    Form của bạn có dữ liệu chưa lưu. Nếu rời trang, các thông tin đã nhập có thể bị mất. Bạn có chắc muốn rời trang?
                  </p>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border-3 border-black bg-white px-5 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                    onClick={() => setShowModal(false)}
                  >
                    Ở LẠI TRANG
                  </button>
                  <button
                    type="button"
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-none border-3 border-black px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] ${exitContext === 'vietqr' ? 'bg-[#ff4444] text-white' : 'bg-[#2d2d2d] text-[#fff100]'}`}
                    onClick={() => setShowModal(false)}
                  >
                    {exitContext === 'vietqr' ? 'HỦY ĐƠN VÀ RỜI TRANG' : 'RỜI TRANG'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
