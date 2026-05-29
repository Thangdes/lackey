"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { KeyboardVisualizer } from "./KeyboardVisualizer";
import { ConfiguratorWizard, ConfigState } from "./ConfiguratorWizard";
import { PricingSummary } from "./PricingSummary";
import { OrderRequestModal } from "./OrderRequestModal";


function CustomKeyboardClientContent() {
  const searchParams = useSearchParams();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [keyOverrides, setKeyOverrides] = useState<Record<string, "alpha" | "mod" | "accent">>({});
  const [activeBrush, setActiveBrush] = useState<"alpha" | "mod" | "accent" | null>(null);

  // Initialize state from URL params if present, else use default values
  const [config, setConfig] = useState<ConfigState>({
    layout: "75",
    caseColor: "white", // default to white matching photo
    plateMaterial: "pc",
    switchType: "red_max", // default to Red Max
    keycapTheme: "vintageSky", // default to Vintage Sky matching photo
    accentColor: "default",
    hasCable: false,
    hasAssembly: false,
  });

  useEffect(() => {
    if (!searchParams) return;

    const rawLayout = searchParams.get("layout");
    const layout: ConfigState["layout"] = (rawLayout === "60" || rawLayout === "65" || rawLayout === "75" || rawLayout === "tkl") ? rawLayout : "75";

    const rawSwitch = searchParams.get("switch");
    let switchType: ConfigState["switchType"] = "red_max";
    if (rawSwitch === "blue_max" || rawSwitch === "clicky") switchType = "blue_max";
    else if (rawSwitch === "red_max" || rawSwitch === "linear") switchType = "red_max";
    else if (rawSwitch === "brown_max" || rawSwitch === "tactile") switchType = "brown_max";
    else if (rawSwitch === "black_max") switchType = "black_max";

    setConfig({
      layout,
      caseColor: searchParams.get("case") || "white",
      plateMaterial: searchParams.get("plate") || "pc",
      switchType,
      keycapTheme: searchParams.get("keycap") || "vintageSky",
      accentColor: searchParams.get("accent") || "default",
      hasCable: searchParams.get("cable") === "true",
      hasAssembly: searchParams.get("assembly") === "true",
    });

    const rawOverrides = searchParams.get("overrides");
    const overrides: Record<string, "alpha" | "mod" | "accent"> = {};
    if (rawOverrides) {
      rawOverrides.split(",").forEach((item) => {
        const [code, type] = item.split(":");
        if (code && (type === "alpha" || type === "mod" || type === "accent")) {
          overrides[code] = type;
        }
      });
    }
    setKeyOverrides(overrides);
  }, [searchParams]);

  const updateUrl = (updatedConfig: ConfigState, overrides: Record<string, "alpha" | "mod" | "accent">) => {
    if (typeof window !== "undefined") {
      const overrideStr = Object.entries(overrides)
        .map(([code, type]) => `${code}:${type}`)
        .join(",");

      const queryParams: Record<string, string> = {
        layout: updatedConfig.layout,
        case: updatedConfig.caseColor,
        plate: updatedConfig.plateMaterial,
        switch: updatedConfig.switchType,
        keycap: updatedConfig.keycapTheme,
        accent: updatedConfig.accentColor,
        cable: String(updatedConfig.hasCable),
        assembly: String(updatedConfig.hasAssembly),
      };

      if (overrideStr) {
        queryParams.overrides = overrideStr;
      }

      const query = new URLSearchParams(queryParams).toString();
      const newUrl = `${window.location.pathname}?${query}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    }
  };

  const handleConfigChange = (newConfig: Partial<ConfigState>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      updateUrl(updated, keyOverrides);
      return updated;
    });
  };

  const handleKeyOverridesChange = (newOverrides: Record<string, "alpha" | "mod" | "accent">) => {
    setKeyOverrides(newOverrides);
    updateUrl(config, newOverrides);
  };

  const handleKeyClickInVisualizer = (code: string) => {
    if (activeBrush) {
      setKeyOverrides((prev) => {
        const next = { ...prev };
        if (next[code] === activeBrush) {
          delete next[code]; // Toggle off if clicked again with the same brush
        } else {
          next[code] = activeBrush;
        }
        updateUrl(config, next);
        return next;
      });
    }
  };



  return (
    <div className="w-full flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden bg-neutral-50/10">
      {/* Left Sidebar (Configurator options + Pricing) */}
      <aside className="w-full lg:w-[420px] xl:w-[460px] shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-200/60 bg-white flex flex-col h-auto lg:h-full overflow-y-visible lg:overflow-hidden order-2 lg:order-1">
        {/* Sticky Sidebar Header */}
        <div className="px-6 py-4.5 border-b border-neutral-100 bg-white shrink-0 hidden lg:block">
          <h2 className="font-extrabold text-neutral-900 text-base tracking-tight uppercase flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-secondary)]" />
            LắcKey Builder
          </h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Cấu hình bàn phím custom
          </p>
        </div>
        
        {/* Scrollable Inner Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 lg:h-full scrollbar-thin">
          <ConfiguratorWizard
            config={config}
            onChange={handleConfigChange}
            keyOverrides={keyOverrides}
            onKeyOverridesChange={handleKeyOverridesChange}
            activeBrush={activeBrush}
            onActiveBrushChange={setActiveBrush}
          />
          <div className="border-t border-neutral-100 pt-6">
            <PricingSummary
              config={config}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              keyOverrides={keyOverrides}
            />
          </div>
        </div>
      </aside>

      {/* Right Main Panel (Keyboard Visualizer + Premium Switch Grid) */}
      <main className="flex-1 flex flex-col items-center p-4 lg:p-10 bg-neutral-50/20 order-1 lg:order-2 h-auto lg:h-full overflow-y-auto min-h-[420px]">
        
        {/* Header */}
        <div className="w-full max-w-5xl flex flex-col mb-5 px-2 shrink-0">
          <h3 className="font-extrabold text-neutral-900 text-base uppercase tracking-wider">Bản Xem Trước Thiết Kế</h3>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Trực quan hóa thiết kế & mô phỏng âm thanh gõ phím trực tiếp</p>
        </div>

        {/* Visualizer Box */}
        <div className="w-full max-w-5xl flex justify-center py-8 lg:py-10 bg-neutral-50/30 rounded-[32px] border border-neutral-200/50 shadow-sm p-4 md:p-8 backdrop-blur-sm">
          <KeyboardVisualizer
            layout={config.layout}
            caseColor={config.caseColor}
            plateMaterial={config.plateMaterial}
            keycapTheme={config.keycapTheme}
            accentColor={config.accentColor}
            switchType={config.switchType}
            keyOverrides={keyOverrides}
            onKeyClick={handleKeyClickInVisualizer}
          />
        </div>
      </main>

      {/* Order Modal popup */}
      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        config={config}
        keyOverrides={keyOverrides}
      />

      <style jsx global>{`
        .font-black-slanted {
          font-family: var(--font-retro), "Arial Black", Impact, sans-serif;
          font-weight: 900;
          font-style: italic;
          letter-spacing: -0.05em;
        }
        .font-bold-slanted {
          font-family: var(--font-retro), "Arial Black", Impact, sans-serif;
          font-weight: 700;
          font-style: italic;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  );
}

export default function CustomKeyboardClient() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-500">Đang tải Configurator...</span>
        </div>
      </div>
    }>
      <CustomKeyboardClientContent />
    </Suspense>
  );
}
