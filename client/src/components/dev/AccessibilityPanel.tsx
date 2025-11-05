"use client";

import { useState, useEffect } from 'react';
import { generateAccessibilityReport } from '@/lib/screen-reader';
import { auditColorCombinations, type ColorPalette } from '@/lib/color-contrast';

const BRAND_COLORS: ColorPalette[] = [
  { name: 'Primary', hex: '#229090', rgb: 'rgb(34, 144, 144)' },
  { name: 'White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
  { name: 'Black', hex: '#000000', rgb: 'rgb(0, 0, 0)' },
  { name: 'Gray', hex: '#6B7280', rgb: 'rgb(107, 114, 128)' },
  { name: 'Red', hex: '#AE1C2C', rgb: 'rgb(174, 28, 44)' },
];

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'contrast' | 'keyboard'>('audit');
  const [report, setReport] = useState<ReturnType<typeof generateAccessibilityReport> | null>(null);
  const [contrastResults, setContrastResults] = useState<ReturnType<typeof auditColorCombinations>>([]);

  const runAudit = () => {
    const newReport = generateAccessibilityReport();
    setReport(newReport);
  };

  const runContrastAudit = () => {
    const results = auditColorCombinations(BRAND_COLORS);
    setContrastResults(results);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'audit') {
      runAudit();
    } else if (isOpen && activeTab === 'contrast') {
      runContrastAudit();
    }
  }, [isOpen, activeTab]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        aria-label="Toggle accessibility panel"
      >
        ♿ A11y
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] bg-white border-2 border-black shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b-2 border-black">
            <h3 className="font-bold text-lg">Accessibility Tools</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl hover:text-red-600"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          <div className="flex border-b-2 border-black">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 px-4 py-2 font-medium ${
                activeTab === 'audit' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              Audit
            </button>
            <button
              onClick={() => setActiveTab('contrast')}
              className={`flex-1 px-4 py-2 font-medium ${
                activeTab === 'contrast' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              Contrast
            </button>
            <button
              onClick={() => setActiveTab('keyboard')}
              className={`flex-1 px-4 py-2 font-medium ${
                activeTab === 'keyboard' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              Keyboard
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'audit' && report && (
              <div>
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold mb-2">
                    Score: {report.score}/100
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-red-600">
                      ❌ Errors: {report.errors}
                    </div>
                    <div className="text-yellow-600">
                      ⚠️ Warnings: {report.warnings}
                    </div>
                    <div className="text-blue-600">
                      ℹ️ Info: {report.infos}
                    </div>
                  </div>
                </div>

                <button
                  onClick={runAudit}
                  className="w-full mb-4 px-4 py-2 bg-purple-600 text-white font-medium hover:bg-purple-700"
                >
                  🔄 Re-run Audit
                </button>

                <div className="space-y-2">
                  {report.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 border-l-4 ${
                        issue.severity === 'error'
                          ? 'border-red-500 bg-red-50'
                          : issue.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-medium text-sm">{issue.issue}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {issue.element}
                      </div>
                      {issue.wcagCriterion && (
                        <div className="text-xs text-gray-500 mt-1">
                          WCAG: {issue.wcagCriterion}
                        </div>
                      )}
                      {issue.suggestion && (
                        <div className="text-xs text-green-700 mt-1">
                          💡 {issue.suggestion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contrast' && (
              <div>
                <button
                  onClick={runContrastAudit}
                  className="w-full mb-4 px-4 py-2 bg-purple-600 text-white font-medium hover:bg-purple-700"
                >
                  🔄 Check Contrast
                </button>

                <div className="space-y-2">
                  {contrastResults.slice(0, 10).map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 border ${
                        result.score === 'AAA'
                          ? 'border-green-500 bg-green-50'
                          : result.score === 'AA'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 border border-black"
                          style={{ backgroundColor: result.fg.hex }}
                        />
                        <span className="text-sm">on</span>
                        <div
                          className="w-6 h-6 border border-black"
                          style={{ backgroundColor: result.bg.hex }}
                        />
                        <span className="font-bold ml-auto">{result.score}</span>
                      </div>
                      <div className="text-xs">
                        {result.fg.name} on {result.bg.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        Ratio: {result.result.ratio}:1
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'keyboard' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h4 className="font-bold mb-2">⌨️ Keyboard Shortcuts</h4>
                  <ul className="text-sm space-y-1">
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Tab</kbd> - Next element</li>
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Shift+Tab</kbd> - Previous element</li>
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd> - Activate button/link</li>
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Space</kbd> - Activate button</li>
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd> - Close modal/dialog</li>
                    <li><kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd> - Navigate lists</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200">
                  <h4 className="font-bold mb-2">✅ Checklist</h4>
                  <ul className="text-sm space-y-1">
                    <li>☑️ All interactive elements focusable</li>
                    <li>☑️ Focus visible on all elements</li>
                    <li>☑️ Tab order logical</li>
                    <li>☑️ Modals trap focus</li>
                    <li>☑️ Skip to content link present</li>
                    <li>☑️ No keyboard traps</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200">
                  <h4 className="font-bold mb-2">🎯 Testing Tips</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Unplug mouse and navigate</li>
                    <li>• Use screen reader (NVDA/JAWS)</li>
                    <li>• Test with high contrast mode</li>
                    <li>• Zoom to 200%</li>
                    <li>• Test with voice control</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
