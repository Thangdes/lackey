"use client"

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-30 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] mb-16 md:mb-0">
        
        {/* Chat Window */}
        <div 
          className={`flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none absolute bottom-16 right-0'}`}
          style={{ width: 'min(calc(100vw - 2rem), 380px)', height: '500px', maxHeight: 'calc(100vh - 8rem)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-secondary)] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">LắcKey Assistant</h3>
                <p className="text-xs text-white/80">Trực tuyến</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Đóng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950">
            {/* Bot Message */}
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-secondary)] flex-shrink-0 flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-neutral-800 dark:text-neutral-200">
                Xin chào! Tôi có thể giúp gì cho bạn?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                className="flex-1 bg-neutral-100 dark:bg-neutral-800 border-transparent focus:bg-white dark:focus:bg-neutral-900 focus:border-[var(--brand-accent)] focus:ring-0 rounded-full px-4 py-2 text-sm text-neutral-900 dark:text-white transition-colors"
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center flex-shrink-0 hover:bg-[var(--brand-secondary)] transition-colors"
              >
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          aria-label={isOpen ? "Đóng Chatbot" : "Mở Chatbot"}
          className={`group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-secondary)] text-white shadow-xl hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/50 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'h-0 w-0 opacity-0 overflow-hidden' : 'h-12 w-12 md:h-14 md:w-14 opacity-100'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen && (
            <>
              <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--brand-accent)]/20 motion-safe:animate-ping" aria-hidden />
              <MessageCircle className="relative h-6 w-6 md:h-7 md:w-7 transition-transform duration-300" />
              
              <span className="pointer-events-none absolute right-16 whitespace-nowrap bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10">
                Chat
                <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neutral-900"></span>
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default ChatWidget;
