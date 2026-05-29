"use client";
import React, { useState, useEffect, useRef } from "react";
import { CASE_COLORS, KEYCAP_THEMES, PLATE_MATERIALS } from "./KeyboardVisualizer";
import { playKeySound } from "./soundSynth";
import { 
  Keyboard, 
  Volume2, 
  ChevronDown, 
  Plus, 
  Minus, 
  RotateCcw, 
  Check, 
  Edit3, 
  Type 
} from "lucide-react";

export interface ConfigState {
  layout: "60" | "65" | "75" | "tkl";
  caseColor: string;
  plateMaterial: string;
  switchType: "blue_max" | "red_max" | "brown_max" | "black_max";
  keycapTheme: string;
  accentColor: string; // "default" or HEX
  hasCable: boolean;
  hasAssembly: boolean;
}

interface ConfiguratorWizardProps {
  config: ConfigState;
  onChange: (config: Partial<ConfigState>) => void;
  keyOverrides?: Record<string, "alpha" | "mod" | "accent">;
  onKeyOverridesChange?: (overrides: Record<string, "alpha" | "mod" | "accent">) => void;
  activeBrush?: "alpha" | "mod" | "accent" | null;
  onActiveBrushChange?: (brush: "alpha" | "mod" | "accent" | null) => void;
}

const LAYOUT_OPTIONS = [
  { id: "60", name: "60% Mini Layout", basePrice: 850000 },
  { id: "65", name: "65% Compact Layout", basePrice: 1200000 },
  { id: "75", name: "75% Exploded Layout", basePrice: 1450000 },
  { id: "tkl", name: "80% TKL Classic", basePrice: 1600000 },
] as const;

const ACCENT_COLORS = [
  { id: "default", name: "Mặc định theo Theme", color: "transparent" },
  { id: "#ea580c", name: "Cam Carbon", color: "#ea580c" },
  { id: "#06b6d4", name: "Xanh Cyan", color: "#06b6d4" },
  { id: "#ec4899", name: "Hồng Neon", color: "#ec4899" },
  { id: "#10b981", name: "Xanh Lục", color: "#10b981" },
  { id: "#eab308", name: "Vàng Mustard", color: "#eab308" },
  { id: "#6366f1", name: "Tím Indigo", color: "#6366f1" },
];

const TYPING_TEST_QUOTES = [
  "LắcKey Configurator mang lại trải nghiệm tự ráp phím cơ custom cực kỳ trực quan. Hãy gõ thử câu này để cảm nhận chất âm gõ phím chân thực nhất.",
  "Bàn phím cơ custom của bạn có âm thanh thock hay clack? Điều đó tùy thuộc vào switch Gateron Pro Yellow hay Kailh Box White cùng tấm định vị bạn chọn.",
  "Thiết kế cơ học độc bản, foam tiêu âm dày dặn, lube stabilizer tỉ mỉ sẽ biến chiếc bàn phím LắcKey thành người bạn đồng hành hoàn hảo mỗi ngày gõ phím."
];

// Custom Select Component
interface SelectOption {
  id: string;
  name: string;
  priceText?: string;
  preview?: React.ReactNode;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

function CustomSelect({ label, value, options, onChange, icon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pl-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl px-4.5 py-3.5 text-sm font-semibold text-neutral-800 transition-all select-none text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 shadow-xs"
      >
        <div className="flex items-center gap-3">
          {selectedOption?.preview || icon}
          <span className="truncate">{selectedOption?.name || value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-neutral-200/90 rounded-2xl shadow-xl max-h-64 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-100 scrollbar-thin">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all text-left cursor-pointer mb-0.5 last:mb-0 ${
                opt.id === value
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {opt.preview}
                <span className="truncate">{opt.name}</span>
              </div>
              {opt.priceText && (
                <span className={`text-[10px] uppercase font-extrabold shrink-0 ml-2 ${opt.id === value ? "text-neutral-300" : "text-neutral-500"}`}>
                  {opt.priceText}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfiguratorWizard({
  config,
  onChange,
  keyOverrides = {},
  onKeyOverridesChange,
  activeBrush = null,
  onActiveBrushChange
}: ConfiguratorWizardProps) {
  const [activeTab, setActiveTab] = useState<"options" | "editor" | "test">("options");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    case: true,
    colorways: true,
    addons: true,
  });

  // Typing test states
  const [typedText, setTypedText] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const testQuote = TYPING_TEST_QUOTES[quoteIndex];

  // Helper options conversion
  const layoutOptions = LAYOUT_OPTIONS.map((opt) => ({
    id: opt.id,
    name: opt.name,
    priceText: `+${opt.basePrice.toLocaleString("vi-VN")} ₫`,
    preview: <Keyboard className="w-4 h-4 text-neutral-500 shrink-0" />
  }));

  const switchOptions = [
    { 
      id: "blue_max", 
      name: "Blue Max Clicky (Kailh Box)", 
      priceText: "+350.000 ₫",
      preview: <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-sky-500 inline-block shrink-0 shadow-inner" /> 
    },
    { 
      id: "red_max", 
      name: "Red Max Linear (Gateron Pro)", 
      priceText: "+280.000 ₫",
      preview: <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-red-500 inline-block shrink-0 shadow-inner" /> 
    },
    { 
      id: "brown_max", 
      name: "Brown Max Tactile (Akko Jelly)", 
      priceText: "+320.000 ₫",
      preview: <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-amber-700 inline-block shrink-0 shadow-inner" /> 
    },
    { 
      id: "black_max", 
      name: "Black Max Heavy Linear", 
      priceText: "+300.000 ₫",
      preview: <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-neutral-900 inline-block shrink-0 shadow-inner" /> 
    },
  ];

  const plateOptions = Object.entries(PLATE_MATERIALS).map(([id, opt]) => {
    let extraPrice = 150000;
    if (id === "brass") extraPrice = 380000;
    else if (id === "fr4") extraPrice = 200000;
    else if (id === "aluminum") extraPrice = 250000;

    return {
      id,
      name: opt.name,
      priceText: `+${extraPrice.toLocaleString("vi-VN")} ₫`,
      preview: <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0 shadow-inner" style={{ backgroundColor: opt.color }} />
    };
  });

  const caseOptions = Object.entries(CASE_COLORS).map(([id, opt]) => {
    let extraPrice = 0;
    if (id === "acrylic") extraPrice = 250000;
    else if (id === "gray") extraPrice = 300000;

    return {
      id,
      name: opt.name,
      priceText: extraPrice > 0 ? `+${extraPrice.toLocaleString("vi-VN")} ₫` : "Bao gồm",
      preview: (
        <span 
          className="w-3.5 h-3.5 rounded-md border border-neutral-300 inline-block shrink-0 relative overflow-hidden shadow-inner" 
          style={{ backgroundColor: opt.bg }}
        >
          {id === "acrylic" && (
            <span className="absolute inset-0 bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 opacity-40 animate-pulse" />
          )}
        </span>
      )
    };
  });

  const keycapOptions = Object.entries(KEYCAP_THEMES).map(([id, opt]) => {
    let extraPrice = 450000;
    if (id === "carbonSlate") extraPrice = 580000;
    else if (id === "matcha") extraPrice = 520000;
    else if (id === "cyberpunk") extraPrice = 650000;
    else if (id === "vintageSky") extraPrice = 480000;

    return {
      id,
      name: opt.name,
      priceText: `+${extraPrice.toLocaleString("vi-VN")} ₫`,
      preview: (
        <span className="flex gap-0.5 items-center shrink-0 border border-neutral-200/50 p-0.5 rounded bg-neutral-50 shadow-inner">
          <span className="w-2 h-2 rounded-xs border border-neutral-300/55 inline-block" style={{ backgroundColor: opt.alphas }} />
          <span className="w-2 h-2 rounded-xs border border-neutral-300/55 inline-block" style={{ backgroundColor: opt.mods }} />
          <span className="w-2 h-2 rounded-xs border border-neutral-300/55 inline-block" style={{ backgroundColor: opt.accents }} />
        </span>
      )
    };
  });

  const accentOptions = ACCENT_COLORS.map((opt) => ({
    id: opt.id,
    name: opt.name,
    preview: opt.id === "default" ? (
      <span className="w-3.5 h-3.5 rounded-full border border-dashed border-neutral-300 bg-gradient-to-r from-red-400 via-green-400 to-blue-400 inline-block shrink-0 shadow-inner" />
    ) : (
      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0 shadow-inner" style={{ backgroundColor: opt.color }} />
    )
  }));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTypedText(value);

    // Play a key sound on keystroke
    playKeySound(config.switchType, config.plateMaterial);

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === testQuote[i]) {
        correctChars++;
      }
    }
    const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(currentAccuracy);

    // Calculate WPM
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.01) {
        const words = value.length / 5;
        setWpm(Math.round(words / elapsedMinutes));
      }
    }
  };

  const resetTypingTest = () => {
    setTypedText("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % TYPING_TEST_QUOTES.length);
    resetTypingTest();
  };

  const currentTheme = KEYCAP_THEMES[config.keycapTheme] || KEYCAP_THEMES.carbonSlate;
  const currentAccentColor = config.accentColor !== "default" ? config.accentColor : currentTheme.accents;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 3 Main Tab Headers */}
      <div className="flex border-b border-neutral-200/80 pb-2 overflow-x-auto scrollbar-none gap-2">
        {([
          { id: "options", label: "Options", icon: <Keyboard className="w-4 h-4" /> },
          { id: "editor", label: "Editor", icon: <Edit3 className="w-4 h-4" /> },
          { id: "test", label: "Test", icon: <Type className="w-4 h-4" /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              // Disable brush if moving away from Editor
              if (tab.id !== "editor" && onActiveBrushChange) {
                onActiveBrushChange(null);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 min-h-[350px]">
        {/* Tab 1: OPTIONS */}
        {activeTab === "options" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* GENERAL SECTION */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                type="button"
                onClick={() => toggleSection("general")}
                className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-neutral-800 hover:text-neutral-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  General
                </span>
                {expandedSections.general ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
              </button>
              
              {expandedSections.general && (
                <div className="mt-3.5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150 pl-2">
                  <CustomSelect
                    label="Layout bàn phím"
                    value={config.layout}
                    options={layoutOptions}
                    onChange={(val) => onChange({ layout: val as "60" | "65" | "75" | "tkl" })}
                  />

                  <div className="flex gap-2 items-end w-full">
                    <div className="flex-1">
                      <CustomSelect
                        label="Loại Switch"
                        value={config.switchType}
                        options={switchOptions}
                        onChange={(val) => {
                          const typedVal = val as "blue_max" | "red_max" | "brown_max" | "black_max";
                          onChange({ switchType: typedVal });
                          playKeySound(typedVal, config.plateMaterial);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => playKeySound(config.switchType, config.plateMaterial)}
                      className="h-[49px] w-[49px] bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 mb-0"
                      title="Nghe thử âm thanh switch"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <CustomSelect
                    label="Tấm định vị (Plate)"
                    value={config.plateMaterial}
                    options={plateOptions}
                    onChange={(val) => onChange({ plateMaterial: val })}
                  />
                </div>
              )}
            </div>

            {/* CASE OPTIONS SECTION */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                type="button"
                onClick={() => toggleSection("case")}
                className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-neutral-800 hover:text-neutral-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  Case Options
                </span>
                {expandedSections.case ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
              </button>

              {expandedSections.case && (
                <div className="mt-3.5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150 pl-2">
                  <CustomSelect
                    label="Màu vỏ phím"
                    value={config.caseColor}
                    options={caseOptions}
                    onChange={(val) => onChange({ caseColor: val })}
                  />
                </div>
              )}
            </div>

            {/* COLORWAYS SECTION */}
            <div className="border-b border-neutral-100 pb-4">
              <button
                type="button"
                onClick={() => toggleSection("colorways")}
                className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-neutral-800 hover:text-neutral-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  Colorways & Keycaps
                </span>
                {expandedSections.colorways ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
              </button>

              {expandedSections.colorways && (
                <div className="mt-3.5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150 pl-2">
                  <CustomSelect
                    label="Theme Màu Keycaps"
                    value={config.keycapTheme}
                    options={keycapOptions}
                    onChange={(val) => onChange({ keycapTheme: val })}
                  />

                  <CustomSelect
                    label="Phím Nhấn Accent"
                    value={config.accentColor}
                    options={accentOptions}
                    onChange={(val) => onChange({ accentColor: val })}
                  />
                </div>
              )}
            </div>

            {/* ADD-ONS SECTION */}
            <div className="pb-2">
              <button
                type="button"
                onClick={() => toggleSection("addons")}
                className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-neutral-800 hover:text-neutral-900 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  Add-ons & Services
                </span>
                {expandedSections.addons ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-neutral-400" />}
              </button>

              {expandedSections.addons && (
                <div className="mt-3.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150 pl-2">
                  {/* Coiled Cable Custom */}
                  <button
                    type="button"
                    onClick={() => onChange({ hasCable: !config.hasCable })}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      config.hasCable
                        ? "border-neutral-900 bg-neutral-50/50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-neutral-800 text-xs">Cáp Xoắn Custom Coiled (+350k)</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Dây bọc dù cao cấp Aviator</div>
                    </div>
                    {config.hasCable ? (
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center"><Check className="w-3 h-3" /></span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-neutral-300" />
                    )}
                  </button>

                  {/* Modding Service */}
                  <button
                    type="button"
                    onClick={() => onChange({ hasAssembly: !config.hasAssembly })}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      config.hasAssembly
                        ? "border-neutral-900 bg-neutral-50/50"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-neutral-800 text-xs">Modding & Lắp Ráp Trọn Gói (+250k)</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Lube switch, cân stab, lót foam kỹ thuật</div>
                    </div>
                    {config.hasAssembly ? (
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center"><Check className="w-3 h-3" /></span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-neutral-300" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: EDITOR */}
        {activeTab === "editor" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/50">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                🎨 Cọ Vẽ Màu Keycap
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">
                Nhấp chuột chọn cọ vẽ bên dưới, sau đó <strong>click trực tiếp lên bất kỳ phím nào</strong> trên hình minh họa bên phải để thay đổi phối màu phím đó.
              </p>
            </div>

            {/* Brush Selection Panel */}
            <div className="grid grid-cols-1 gap-2.5">
              {([
                { id: "alpha", name: "Cọ Phím Chữ (Alphas)", desc: "Màu ký tự chính", bg: currentTheme.alphas, text: currentTheme.legend },
                { id: "mod", name: "Cọ Phím Chức Năng (Mods)", desc: "Màu các phím Alt, Ctrl, Shift...", bg: currentTheme.mods, text: currentTheme.modLegend },
                { id: "accent", name: "Cọ Phím Nhấn (Accent)", desc: "Màu phím nổi bật Esc/Enter...", bg: currentAccentColor, text: currentTheme.accentLegend },
              ] as const).map((brush) => (
                <button
                  key={brush.id}
                  type="button"
                  onClick={() => onActiveBrushChange && onActiveBrushChange(activeBrush === brush.id ? null : brush.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    activeBrush === brush.id
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Keycap preview block */}
                    <div 
                      className="w-9 h-9 rounded-lg border border-neutral-300 shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: brush.bg }}
                    >
                      <span className="font-extrabold text-[10px]" style={{ color: brush.text }}>Aa</span>
                    </div>
                    <div>
                      <div className="font-bold text-neutral-800 text-xs">{brush.name}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{brush.desc}</div>
                    </div>
                  </div>
                  {activeBrush === brush.id && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center"><Check className="w-3 h-3" /></span>
                  )}
                </button>
              ))}
            </div>

            {/* Reset painted keys */}
            {Object.keys(keyOverrides).length > 0 && (
              <button
                type="button"
                onClick={() => onKeyOverridesChange && onKeyOverridesChange({})}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition-all cursor-pointer text-xs font-bold shadow-xs active:scale-99"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi Phục Mặc Định ({Object.keys(keyOverrides).length} phím)</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 3: TEST */}
        {activeTab === "test" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/50">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-neutral-900">⌨️ Khu Vực Gõ Thử Âm Thanh</h4>
                <button
                  type="button"
                  onClick={nextQuote}
                  className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đổi câu khác</span>
                </button>
              </div>
              
              {/* Target quote */}
              <div className="mt-2.5 p-3.5 bg-white border border-neutral-200/80 rounded-xl text-neutral-700 text-xs font-medium leading-relaxed select-none">
                {testQuote}
              </div>
            </div>

            {/* Real-time stats panel */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Tốc độ (WPM)</span>
                <span className="text-xl font-black text-neutral-800 mt-1">{wpm}</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Độ chính xác</span>
                <span className="text-xl font-black text-neutral-800 mt-1">{accuracy}%</span>
              </div>
            </div>

            {/* Typing Textarea */}
            <div className="relative">
              <textarea
                value={typedText}
                onChange={handleTyping}
                placeholder="Bắt đầu gõ câu trên vào đây để kiểm tra âm thanh gõ phím..."
                className="w-full h-28 border border-neutral-300 rounded-2xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-neutral-800 resize-none shadow-inner"
              />
              {typedText.length > 0 && (
                <button
                  type="button"
                  onClick={resetTypingTest}
                  className="absolute bottom-3 right-3 text-[10px] font-bold text-neutral-400 hover:text-neutral-700 bg-white/90 border border-neutral-200 rounded-lg px-2 py-1 shadow-sm transition-colors cursor-pointer"
                >
                  Gõ lại
                </button>
              )}
            </div>

            {/* Typing completed feedback */}
            {typedText === testQuote && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-center text-emerald-800 text-xs font-bold animate-bounce mt-2">
                🎉 Tuyệt vời! Bạn đã hoàn thành bài gõ thử!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
