"use client";
import React, { useEffect, useState } from "react";
import { playKeySound, playKnobClickSound } from "./soundSynth";
import { toast } from "sonner";

// Key interface
interface KeyConfig {
  code: string;
  label: string;
  w: number; // width in u
  type: "alpha" | "mod" | "accent" | "blank";
  xOffset?: number; // horizontal spacing offset in u
}

// Color Theme interface
export interface KeycapTheme {
  name: string;
  alphas: string;     // alpha background
  mods: string;       // modifier background
  accents: string;    // accent background
  legend: string;     // alpha legend text
  modLegend: string;  // modifier legend text
  accentLegend: string; // accent legend text
}

export const KEYCAP_THEMES: Record<string, KeycapTheme> = {
  vintageSky: {
    name: "Vintage Sky & Amber (Trắng/Xanh/Cam)",
    alphas: "#ffffff",
    mods: "#93c5fd",   // Sky blue
    accents: "#f97316",  // Orange-red
    legend: "#4b5563",
    modLegend: "#1e40af",
    accentLegend: "#ffffff",
  },
  carbonSlate: {
    name: "Carbon Slate (Xám/Đen/Cam)",
    alphas: "#d1d5db", // light gray
    mods: "#374151",   // dark gray
    accents: "#f97316",  // orange
    legend: "#111827",
    modLegend: "#f9fafb",
    accentLegend: "#ffffff",
  },
  matcha: {
    name: "Matcha Forest (Xanh Lá/Kem)",
    alphas: "#fcf8f2", // cream
    mods: "#2d4a22",   // dark forest green
    accents: "#84a98c",  // sage green
    legend: "#1b2a1a",
    modLegend: "#ffffff",
    accentLegend: "#1b2a1a",
  },
  cyberpunk: {
    name: "Cyberpunk Neon (Tím/Cyan/Hồng)",
    alphas: "#1e1b4b", // deep blue/purple
    mods: "#4a044e",   // dark magenta
    accents: "#db2777",  // hot pink
    legend: "#22d3ee",  // neon cyan
    modLegend: "#f472b6", // pink legend
    accentLegend: "#ffffff",
  },
  lavender: {
    name: "Lavender Mist (Oải Hương/Trắng)",
    alphas: "#ffffff",
    mods: "#ddd6fe",   // soft lavender
    accents: "#8b5cf6",  // vibrant violet
    legend: "#4c1d95",
    modLegend: "#2e1065",
    accentLegend: "#ffffff",
  },
  monochrome: {
    name: "Minimalist (Trắng/Đen)",
    alphas: "#ffffff",
    mods: "#f3f4f6",   // light gray
    accents: "#111827",  // pure dark gray
    legend: "#111827",
    modLegend: "#374151",
    accentLegend: "#ffffff",
  },
};

export const CASE_COLORS: Record<string, { name: string; bg: string; border: string; labelColor: string; shadow?: string }> = {
  black: {
    name: "Đen Nhám (Matte Black)",
    bg: "#111827",
    border: "#374151",
    labelColor: "#ffffff",
  },
  white: {
    name: "Trắng Sữa (E-White)",
    bg: "#f9fafb",
    border: "#e5e7eb",
    labelColor: "#111827",
  },
  gray: {
    name: "Xám Không Gian (Space Gray)",
    bg: "#4b5563",
    border: "#6b7280",
    labelColor: "#ffffff",
  },
  pink: {
    name: "Hồng Pastel (E-Pink)",
    bg: "#fbcfe8",
    border: "#f9a8d4",
    labelColor: "#4a044e",
  },
  acrylic: {
    name: "Acrylic Mờ (Frosted Acrylic)",
    bg: "rgba(243, 244, 246, 0.45)",
    border: "rgba(255, 255, 255, 0.6)",
    labelColor: "#111827",
    shadow: "0 0 25px rgba(236, 72, 153, 0.5), 0 0 50px rgba(59, 130, 246, 0.3)",
  },
};

export const PLATE_MATERIALS: Record<string, { name: string; color: string; desc: string }> = {
  pc: { name: "Polycarbonate (PC)", color: "#e4e4e7", desc: "Mềm dẻo, thock trầm ấm" },
  brass: { name: "Đồng (Brass)", color: "#eab308", desc: "Cứng cáp, đanh vang clack" },
  fr4: { name: "FR4 (Phíp nhựa)", color: "#1c1917", desc: "Cân bằng, âm ấm trung tính" },
  aluminum: { name: "Nhôm (Aluminum)", color: "#9ca3af", desc: "Độ gõ chắc chắn, vang vừa" },
};

// Define keyboard layouts
const LAYOUT_60: KeyConfig[][] = [
  [
    { code: "Escape", label: "ESC", w: 1, type: "accent" },
    { code: "Digit1", label: "1", w: 1, type: "alpha" },
    { code: "Digit2", label: "2", w: 1, type: "alpha" },
    { code: "Digit3", label: "3", w: 1, type: "alpha" },
    { code: "Digit4", label: "4", w: 1, type: "alpha" },
    { code: "Digit5", label: "5", w: 1, type: "alpha" },
    { code: "Digit6", label: "6", w: 1, type: "alpha" },
    { code: "Digit7", label: "7", w: 1, type: "alpha" },
    { code: "Digit8", label: "8", w: 1, type: "alpha" },
    { code: "Digit9", label: "9", w: 1, type: "alpha" },
    { code: "Digit0", label: "0", w: 1, type: "alpha" },
    { code: "Minus", label: "-", w: 1, type: "alpha" },
    { code: "Equal", label: "=", w: 1, type: "alpha" },
    { code: "Backspace", label: "← BKSP", w: 2, type: "mod" },
  ],
  [
    { code: "Tab", label: "TAB", w: 1.5, type: "mod" },
    { code: "KeyQ", label: "Q", w: 1, type: "alpha" },
    { code: "KeyW", label: "W", w: 1, type: "alpha" },
    { code: "KeyE", label: "E", w: 1, type: "alpha" },
    { code: "KeyR", label: "R", w: 1, type: "alpha" },
    { code: "KeyT", label: "T", w: 1, type: "alpha" },
    { code: "KeyY", label: "Y", w: 1, type: "alpha" },
    { code: "KeyU", label: "U", w: 1, type: "alpha" },
    { code: "KeyI", label: "I", w: 1, type: "alpha" },
    { code: "KeyO", label: "O", w: 1, type: "alpha" },
    { code: "KeyP", label: "P", w: 1, type: "alpha" },
    { code: "BracketLeft", label: "[", w: 1, type: "alpha" },
    { code: "BracketRight", label: "]", w: 1, type: "alpha" },
    { code: "Backslash", label: "\\", w: 1.5, type: "mod" },
  ],
  [
    { code: "CapsLock", label: "CAPS", w: 1.75, type: "mod" },
    { code: "KeyA", label: "A", w: 1, type: "alpha" },
    { code: "KeyS", label: "S", w: 1, type: "alpha" },
    { code: "KeyD", label: "D", w: 1, type: "alpha" },
    { code: "KeyF", label: "F", w: 1, type: "alpha" },
    { code: "KeyG", label: "G", w: 1, type: "alpha" },
    { code: "KeyH", label: "H", w: 1, type: "alpha" },
    { code: "KeyJ", label: "J", w: 1, type: "alpha" },
    { code: "KeyK", label: "K", w: 1, type: "alpha" },
    { code: "KeyL", label: "L", w: 1, type: "alpha" },
    { code: "Semicolon", label: ";", w: 1, type: "alpha" },
    { code: "Quote", label: "'", w: 1, type: "alpha" },
    { code: "Enter", label: "ENTER ↵", w: 2.25, type: "accent" },
  ],
  [
    { code: "ShiftLeft", label: "SHIFT ⇧", w: 2.25, type: "mod" },
    { code: "KeyZ", label: "Z", w: 1, type: "alpha" },
    { code: "KeyX", label: "X", w: 1, type: "alpha" },
    { code: "KeyC", label: "C", w: 1, type: "alpha" },
    { code: "KeyV", label: "V", w: 1, type: "alpha" },
    { code: "KeyB", label: "B", w: 1, type: "alpha" },
    { code: "KeyN", label: "N", w: 1, type: "alpha" },
    { code: "KeyM", label: "M", w: 1, type: "alpha" },
    { code: "Comma", label: ",", w: 1, type: "alpha" },
    { code: "Period", label: ".", w: 1, type: "alpha" },
    { code: "Slash", label: "/", w: 1, type: "alpha" },
    { code: "ShiftRight", label: "SHIFT ⇧", w: 2.75, type: "mod" },
  ],
  [
    { code: "ControlLeft", label: "CTRL", w: 1.25, type: "mod" },
    { code: "MetaLeft", label: "WIN", w: 1.25, type: "mod" },
    { code: "AltLeft", label: "ALT", w: 1.25, type: "mod" },
    { code: "Space", label: "", w: 6.25, type: "accent" },
    { code: "AltRight", label: "ALT", w: 1.25, type: "mod" },
    { code: "MetaRight", label: "WIN", w: 1.25, type: "mod" },
    { code: "ContextMenu", label: "FN", w: 1.25, type: "mod" },
    { code: "ControlRight", label: "CTRL", w: 1.25, type: "mod" },
  ],
];

const LAYOUT_65: KeyConfig[][] = [
  [
    { code: "Escape", label: "ESC", w: 1, type: "accent" },
    { code: "Digit1", label: "1", w: 1, type: "alpha" },
    { code: "Digit2", label: "2", w: 1, type: "alpha" },
    { code: "Digit3", label: "3", w: 1, type: "alpha" },
    { code: "Digit4", label: "4", w: 1, type: "alpha" },
    { code: "Digit5", label: "5", w: 1, type: "alpha" },
    { code: "Digit6", label: "6", w: 1, type: "alpha" },
    { code: "Digit7", label: "7", w: 1, type: "alpha" },
    { code: "Digit8", label: "8", w: 1, type: "alpha" },
    { code: "Digit9", label: "9", w: 1, type: "alpha" },
    { code: "Digit0", label: "0", w: 1, type: "alpha" },
    { code: "Minus", label: "-", w: 1, type: "alpha" },
    { code: "Equal", label: "=", w: 1, type: "alpha" },
    { code: "Backspace", label: "← BKSP", w: 2, type: "mod" },
    { code: "Delete", label: "DEL", w: 1, type: "mod" },
  ],
  [
    { code: "Tab", label: "TAB", w: 1.5, type: "mod" },
    { code: "KeyQ", label: "Q", w: 1, type: "alpha" },
    { code: "KeyW", label: "W", w: 1, type: "alpha" },
    { code: "KeyE", label: "E", w: 1, type: "alpha" },
    { code: "KeyR", label: "R", w: 1, type: "alpha" },
    { code: "KeyT", label: "T", w: 1, type: "alpha" },
    { code: "KeyY", label: "Y", w: 1, type: "alpha" },
    { code: "KeyU", label: "U", w: 1, type: "alpha" },
    { code: "KeyI", label: "I", w: 1, type: "alpha" },
    { code: "KeyO", label: "O", w: 1, type: "alpha" },
    { code: "KeyP", label: "P", w: 1, type: "alpha" },
    { code: "BracketLeft", label: "[", w: 1, type: "alpha" },
    { code: "BracketRight", label: "]", w: 1, type: "alpha" },
    { code: "Backslash", label: "\\", w: 1.5, type: "mod" },
    { code: "PageUp", label: "PGUP", w: 1, type: "mod" },
  ],
  [
    { code: "CapsLock", label: "CAPS", w: 1.75, type: "mod" },
    { code: "KeyA", label: "A", w: 1, type: "alpha" },
    { code: "KeyS", label: "S", w: 1, type: "alpha" },
    { code: "KeyD", label: "D", w: 1, type: "alpha" },
    { code: "KeyF", label: "F", w: 1, type: "alpha" },
    { code: "KeyG", label: "G", w: 1, type: "alpha" },
    { code: "KeyH", label: "H", w: 1, type: "alpha" },
    { code: "KeyJ", label: "J", w: 1, type: "alpha" },
    { code: "KeyK", label: "K", w: 1, type: "alpha" },
    { code: "KeyL", label: "L", w: 1, type: "alpha" },
    { code: "Semicolon", label: ";", w: 1, type: "alpha" },
    { code: "Quote", label: "'", w: 1, type: "alpha" },
    { code: "Enter", label: "ENTER ↵", w: 2.25, type: "accent" },
    { code: "PageDown", label: "PGDN", w: 1, type: "mod" },
  ],
  [
    { code: "ShiftLeft", label: "SHIFT ⇧", w: 2.25, type: "mod" },
    { code: "KeyZ", label: "Z", w: 1, type: "alpha" },
    { code: "KeyX", label: "X", w: 1, type: "alpha" },
    { code: "KeyC", label: "C", w: 1, type: "alpha" },
    { code: "KeyV", label: "V", w: 1, type: "alpha" },
    { code: "KeyB", label: "B", w: 1, type: "alpha" },
    { code: "KeyN", label: "N", w: 1, type: "alpha" },
    { code: "KeyM", label: "M", w: 1, type: "alpha" },
    { code: "Comma", label: ",", w: 1, type: "alpha" },
    { code: "Period", label: ".", w: 1, type: "alpha" },
    { code: "Slash", label: "/", w: 1, type: "alpha" },
    { code: "ShiftRight", label: "SHIFT", w: 1.75, type: "mod" },
    { code: "ArrowUp", label: "▲", w: 1, type: "mod" },
    { code: "End", label: "END", w: 1, type: "mod" },
  ],
  [
    { code: "ControlLeft", label: "CTRL", w: 1.25, type: "mod" },
    { code: "MetaLeft", label: "WIN", w: 1.25, type: "mod" },
    { code: "AltLeft", label: "ALT", w: 1.25, type: "mod" },
    { code: "Space", label: "", w: 6.25, type: "accent" },
    { code: "AltRight", label: "ALT", w: 1, type: "mod" },
    { code: "MetaRight", label: "FN", w: 1, type: "mod" },
    { code: "ControlRight", label: "CTRL", w: 1, type: "mod" },
    { code: "ArrowLeft", label: "◀", w: 1, type: "mod" },
    { code: "ArrowDown", label: "▼", w: 1, type: "mod" },
    { code: "ArrowRight", label: "▶", w: 1, type: "mod" },
  ],
];

const LAYOUT_75: KeyConfig[][] = [
  // Row 0 (Function Row)
  [
    { code: "Escape", label: "ESC", w: 1, type: "accent" },
    { code: "F1", label: "F1", w: 1, type: "mod", xOffset: 0.25 },
    { code: "F2", label: "F2", w: 1, type: "mod" },
    { code: "F3", label: "F3", w: 1, type: "mod" },
    { code: "F4", label: "F4", w: 1, type: "mod" },
    { code: "F5", label: "F5", w: 1, type: "mod", xOffset: 0.25 },
    { code: "F6", label: "F6", w: 1, type: "mod" },
    { code: "F7", label: "F7", w: 1, type: "mod" },
    { code: "F8", label: "F8", w: 1, type: "mod" },
    { code: "F9", label: "F9", w: 1, type: "mod", xOffset: 0.25 },
    { code: "F10", label: "F10", w: 1, type: "mod" },
    { code: "F11", label: "F11", w: 1, type: "mod" },
    { code: "F12", label: "F12", w: 1, type: "mod" },
    { code: "PrintScreen", label: "PRT", w: 1, type: "mod", xOffset: 0.25 },
    { code: "Delete", label: "DEL", w: 1, type: "mod" },
  ],
  // Row 1
  [
    { code: "Backquote", label: "`", w: 1, type: "alpha" },
    { code: "Digit1", label: "1", w: 1, type: "alpha" },
    { code: "Digit2", label: "2", w: 1, type: "alpha" },
    { code: "Digit3", label: "3", w: 1, type: "alpha" },
    { code: "Digit4", label: "4", w: 1, type: "alpha" },
    { code: "Digit5", label: "5", w: 1, type: "alpha" },
    { code: "Digit6", label: "6", w: 1, type: "alpha" },
    { code: "Digit7", label: "7", w: 1, type: "alpha" },
    { code: "Digit8", label: "8", w: 1, type: "alpha" },
    { code: "Digit9", label: "9", w: 1, type: "alpha" },
    { code: "Digit0", label: "0", w: 1, type: "alpha" },
    { code: "Minus", label: "-", w: 1, type: "alpha" },
    { code: "Equal", label: "=", w: 1, type: "alpha" },
    { code: "Backspace", label: "← BKSP", w: 2, type: "mod" },
    { code: "Home", label: "HOME", w: 1, type: "mod" },
  ],
  // Row 2
  [
    { code: "Tab", label: "TAB", w: 1.5, type: "mod" },
    { code: "KeyQ", label: "Q", w: 1, type: "alpha" },
    { code: "KeyW", label: "W", w: 1, type: "alpha" },
    { code: "KeyE", label: "E", w: 1, type: "alpha" },
    { code: "KeyR", label: "R", w: 1, type: "alpha" },
    { code: "KeyT", label: "T", w: 1, type: "alpha" },
    { code: "KeyY", label: "Y", w: 1, type: "alpha" },
    { code: "KeyU", label: "U", w: 1, type: "alpha" },
    { code: "KeyI", label: "I", w: 1, type: "alpha" },
    { code: "KeyO", label: "O", w: 1, type: "alpha" },
    { code: "KeyP", label: "P", w: 1, type: "alpha" },
    { code: "BracketLeft", label: "[", w: 1, type: "alpha" },
    { code: "BracketRight", label: "]", w: 1, type: "alpha" },
    { code: "Backslash", label: "\\", w: 1.5, type: "mod" },
    { code: "PageUp", label: "PGUP", w: 1, type: "mod" },
  ],
  // Row 3
  [
    { code: "CapsLock", label: "CAPS", w: 1.75, type: "mod" },
    { code: "KeyA", label: "A", w: 1, type: "alpha" },
    { code: "KeyS", label: "S", w: 1, type: "alpha" },
    { code: "KeyD", label: "D", w: 1, type: "alpha" },
    { code: "KeyF", label: "F", w: 1, type: "alpha" },
    { code: "KeyG", label: "G", w: 1, type: "alpha" },
    { code: "KeyH", label: "H", w: 1, type: "alpha" },
    { code: "KeyJ", label: "J", w: 1, type: "alpha" },
    { code: "KeyK", label: "K", w: 1, type: "alpha" },
    { code: "KeyL", label: "L", w: 1, type: "alpha" },
    { code: "Semicolon", label: ";", w: 1, type: "alpha" },
    { code: "Quote", label: "'", w: 1, type: "alpha" },
    { code: "Enter", label: "ENTER ↵", w: 2.25, type: "accent" },
    { code: "PageDown", label: "PGDN", w: 1, type: "mod" },
  ],
  // Row 4
  [
    { code: "ShiftLeft", label: "SHIFT ⇧", w: 2.25, type: "mod" },
    { code: "KeyZ", label: "Z", w: 1, type: "alpha" },
    { code: "KeyX", label: "X", w: 1, type: "alpha" },
    { code: "KeyC", label: "C", w: 1, type: "alpha" },
    { code: "KeyV", label: "V", w: 1, type: "alpha" },
    { code: "KeyB", label: "B", w: 1, type: "alpha" },
    { code: "KeyN", label: "N", w: 1, type: "alpha" },
    { code: "KeyM", label: "M", w: 1, type: "alpha" },
    { code: "Comma", label: ",", w: 1, type: "alpha" },
    { code: "Period", label: ".", w: 1, type: "alpha" },
    { code: "Slash", label: "/", w: 1, type: "alpha" },
    { code: "ShiftRight", label: "SHIFT", w: 1.75, type: "mod" },
    { code: "ArrowUp", label: "▲", w: 1, type: "mod" },
    { code: "End", label: "END", w: 1, type: "mod" },
  ],
  // Row 5
  [
    { code: "ControlLeft", label: "CTRL", w: 1.25, type: "mod" },
    { code: "MetaLeft", label: "WIN", w: 1.25, type: "mod" },
    { code: "AltLeft", label: "ALT", w: 1.25, type: "mod" },
    { code: "Space", label: "", w: 6.25, type: "accent" },
    { code: "AltRight", label: "ALT", w: 1, type: "mod" },
    { code: "MetaRight", label: "FN", w: 1, type: "mod" },
    { code: "ControlRight", label: "CTRL", w: 1, type: "mod" },
    { code: "ArrowLeft", label: "◀", w: 1, type: "mod" },
    { code: "ArrowDown", label: "▼", w: 1, type: "mod" },
    { code: "ArrowRight", label: "▶", w: 1, type: "mod" },
  ],
];

const LAYOUT_TKL: KeyConfig[][] = [
  // Function Row
  [
    { code: "Escape", label: "ESC", w: 1, type: "accent" },
    { code: "F1", label: "F1", w: 1, type: "mod", xOffset: 1 },
    { code: "F2", label: "F2", w: 1, type: "mod" },
    { code: "F3", label: "F3", w: 1, type: "mod" },
    { code: "F4", label: "F4", w: 1, type: "mod" },
    { code: "F5", label: "F5", w: 1, type: "mod", xOffset: 0.5 },
    { code: "F6", label: "F6", w: 1, type: "mod" },
    { code: "F7", label: "F7", w: 1, type: "mod" },
    { code: "F8", label: "F8", w: 1, type: "mod" },
    { code: "F9", label: "F9", w: 1, type: "mod", xOffset: 0.5 },
    { code: "F10", label: "F10", w: 1, type: "mod" },
    { code: "F11", label: "F11", w: 1, type: "mod" },
    { code: "F12", label: "F12", w: 1, type: "mod" },
    { code: "PrintScreen", label: "PRT", w: 1, type: "mod", xOffset: 0.5 },
    { code: "ScrollLock", label: "SCL", w: 1, type: "mod" },
    { code: "Pause", label: "PSE", w: 1, type: "mod" },
  ],
  // Alphanumeric Row 1
  [
    { code: "Backquote", label: "`", w: 1, type: "alpha" },
    { code: "Digit1", label: "1", w: 1, type: "alpha" },
    { code: "Digit2", label: "2", w: 1, type: "alpha" },
    { code: "Digit3", label: "3", w: 1, type: "alpha" },
    { code: "Digit4", label: "4", w: 1, type: "alpha" },
    { code: "Digit5", label: "5", w: 1, type: "alpha" },
    { code: "Digit6", label: "6", w: 1, type: "alpha" },
    { code: "Digit7", label: "7", w: 1, type: "alpha" },
    { code: "Digit8", label: "8", w: 1, type: "alpha" },
    { code: "Digit9", label: "9", w: 1, type: "alpha" },
    { code: "Digit0", label: "0", w: 1, type: "alpha" },
    { code: "Minus", label: "-", w: 1, type: "alpha" },
    { code: "Equal", label: "=", w: 1, type: "alpha" },
    { code: "Backspace", label: "← BKSP", w: 2, type: "mod" },
    { code: "Insert", label: "INS", w: 1, type: "mod", xOffset: 0.5 },
    { code: "Home", label: "HOME", w: 1, type: "mod" },
    { code: "PageUp", label: "PGUP", w: 1, type: "mod" },
  ],
  // Alphanumeric Row 2
  [
    { code: "Tab", label: "TAB", w: 1.5, type: "mod" },
    { code: "KeyQ", label: "Q", w: 1, type: "alpha" },
    { code: "KeyW", label: "W", w: 1, type: "alpha" },
    { code: "KeyE", label: "E", w: 1, type: "alpha" },
    { code: "KeyR", label: "R", w: 1, type: "alpha" },
    { code: "KeyT", label: "T", w: 1, type: "alpha" },
    { code: "KeyY", label: "Y", w: 1, type: "alpha" },
    { code: "KeyU", label: "U", w: 1, type: "alpha" },
    { code: "KeyI", label: "I", w: 1, type: "alpha" },
    { code: "KeyO", label: "O", w: 1, type: "alpha" },
    { code: "KeyP", label: "P", w: 1, type: "alpha" },
    { code: "BracketLeft", label: "[", w: 1, type: "alpha" },
    { code: "BracketRight", label: "]", w: 1, type: "alpha" },
    { code: "Backslash", label: "\\", w: 1.5, type: "mod" },
    { code: "Delete", label: "DEL", w: 1, type: "mod", xOffset: 0.5 },
    { code: "End", label: "END", w: 1, type: "mod" },
    { code: "PageDown", label: "PGDN", w: 1, type: "mod" },
  ],
  // Alphanumeric Row 3
  [
    { code: "CapsLock", label: "CAPS", w: 1.75, type: "mod" },
    { code: "KeyA", label: "A", w: 1, type: "alpha" },
    { code: "KeyS", label: "S", w: 1, type: "alpha" },
    { code: "KeyD", label: "D", w: 1, type: "alpha" },
    { code: "KeyF", label: "F", w: 1, type: "alpha" },
    { code: "KeyG", label: "G", w: 1, type: "alpha" },
    { code: "KeyH", label: "H", w: 1, type: "alpha" },
    { code: "KeyJ", label: "J", w: 1, type: "alpha" },
    { code: "KeyK", label: "K", w: 1, type: "alpha" },
    { code: "KeyL", label: "L", w: 1, type: "alpha" },
    { code: "Semicolon", label: ";", w: 1, type: "alpha" },
    { code: "Quote", label: "'", w: 1, type: "alpha" },
    { code: "Enter", label: "ENTER ↵", w: 2.25, type: "accent" },
    { code: "Blank1", label: "", w: 1, type: "blank", xOffset: 0.5 }, // Empty spacing
    { code: "Blank2", label: "", w: 1, type: "blank" },
    { code: "Blank3", label: "", w: 1, type: "blank" },
  ],
  // Alphanumeric Row 4
  [
    { code: "ShiftLeft", label: "SHIFT ⇧", w: 2.25, type: "mod" },
    { code: "KeyZ", label: "Z", w: 1, type: "alpha" },
    { code: "KeyX", label: "X", w: 1, type: "alpha" },
    { code: "KeyC", label: "C", w: 1, type: "alpha" },
    { code: "KeyV", label: "V", w: 1, type: "alpha" },
    { code: "KeyB", label: "B", w: 1, type: "alpha" },
    { code: "KeyN", label: "N", w: 1, type: "alpha" },
    { code: "KeyM", label: "M", w: 1, type: "alpha" },
    { code: "Comma", label: ",", w: 1, type: "alpha" },
    { code: "Period", label: ".", w: 1, type: "alpha" },
    { code: "Slash", label: "/", w: 1, type: "alpha" },
    { code: "ShiftRight", label: "SHIFT ⇧", w: 2.75, type: "mod" },
    { code: "ArrowUp", label: "▲", w: 1, type: "mod", xOffset: 1.5 },
    { code: "Blank5", label: "", w: 1, type: "blank" },
  ],
  // Bottom Row
  [
    { code: "ControlLeft", label: "CTRL", w: 1.25, type: "mod" },
    { code: "MetaLeft", label: "WIN", w: 1.25, type: "mod" },
    { code: "AltLeft", label: "ALT", w: 1.25, type: "mod" },
    { code: "Space", label: "", w: 6.25, type: "accent" },
    { code: "AltRight", label: "ALT", w: 1.25, type: "mod" },
    { code: "MetaRight", label: "WIN", w: 1.25, type: "mod" },
    { code: "ContextMenu", label: "FN", w: 1.25, type: "mod" },
    { code: "ControlRight", label: "CTRL", w: 1.25, type: "mod" },
    { code: "ArrowLeft", label: "◀", w: 1, type: "mod", xOffset: 0.5 },
    { code: "ArrowDown", label: "▼", w: 1, type: "mod" },
    { code: "ArrowRight", label: "▶", w: 1, type: "mod" },
  ],
];

interface KeyboardVisualizerProps {
  layout: "60" | "65" | "75" | "tkl";
  caseColor: string;
  plateMaterial: string;
  keycapTheme: string;
  accentColor: string; // "default" or HEX
  switchType: string;
  keyOverrides?: Record<string, "alpha" | "mod" | "accent">;
  onKeyClick?: (code: string) => void;
}

const adjustColorBrightness = (hex: string, percent: number): string => {
  if (!hex || hex.charAt(0) !== "#") return hex;
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.max(0, Math.min(255, R + percent));
  G = Math.max(0, Math.min(255, G + percent));
  B = Math.max(0, Math.min(255, B + percent));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

export function KeyboardVisualizer({
  layout,
  caseColor,
  plateMaterial,
  keycapTheme,
  accentColor,
  switchType,
  keyOverrides,
  onKeyClick,
}: KeyboardVisualizerProps) {
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
  const [knobRotation, setKnobRotation] = useState(0);

  // Map chosen layout
  const rows = (() => {
    switch (layout) {
      case "60":
        return LAYOUT_60;
      case "65":
        return LAYOUT_65;
      case "75":
        return LAYOUT_75;
      case "tkl":
      default:
        return LAYOUT_TKL;
    }
  })();

  const themeConfig = KEYCAP_THEMES[keycapTheme] || KEYCAP_THEMES.vintageSky || KEYCAP_THEMES.carbonSlate;
  const caseConfig = CASE_COLORS[caseColor] || CASE_COLORS.black;
  const plateConfig = PLATE_MATERIALS[plateMaterial] || PLATE_MATERIALS.pc;

  // Real accent background & text
  const customAccentBg = accentColor !== "default" ? accentColor : themeConfig.accents;
  const is3DActive = false;

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scrolling on arrow keys and spacebar in builder only
      const keysToPrevent = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (keysToPrevent.includes(e.code) && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
      }

      setActiveKeys((prev) => ({ ...prev, [e.code]: true }));
      playKeySound(switchType, plateMaterial);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [switchType, plateMaterial]);

  // Click on screen keycap
  const handleKeyClick = (code: string) => {
    setActiveKeys((prev) => ({ ...prev, [code]: true }));
    playKeySound(switchType, plateMaterial);
    setTimeout(() => {
      setActiveKeys((prev) => ({ ...prev, [code]: false }));
    }, 100);
    if (onKeyClick) {
      onKeyClick(code);
    }
  };

  const handleKnobClick = () => {
    playKnobClickSound();
    setKnobRotation((prev) => prev + 15);
    toast.info("Đã vặn núm xoay LắcKey: Âm lượng +1", {
      id: "knob-volume",
    });
  };

  // 3D Shadow setup for Case
  const calculatedShadow = (() => {
    if (!is3DActive) return caseConfig.shadow || "0 15px 45px -10px rgba(0,0,0,0.45)";
    
    // Multi-layer shadow for deep 3D case block effect
    const baseShadowColor = "rgba(0, 0, 0, 0.4)";
    const extColor1 = adjustColorBrightness(caseConfig.bg, -15);
    const extColor2 = adjustColorBrightness(caseConfig.bg, -25);
    
    return `0 0 0 1px rgba(0, 0, 0, 0.15),
            0 4px 0px 0px ${extColor1},
            0 8px 0px 0px ${extColor2},
            0 16px 28px -4px ${baseShadowColor},
            0 25px 45px -8px rgba(0,0,0,0.3)`;
  })();

  return (
    <div className="w-full flex flex-col items-center" style={{ perspective: "1500px" }}>
      {/* Keyboard Case outer chassis */}
      <div
        id="keyboard-visualizer-capture"
        className="relative p-7 sm:p-9 rounded-[32px] border-8 select-none flex flex-col gap-1.5"
        style={{
          backgroundColor: caseConfig.bg,
          borderColor: caseConfig.border,
          boxShadow: calculatedShadow,
          backdropFilter: caseColor === "acrylic" ? "blur(16px)" : "none",
          transform: is3DActive 
            ? "rotateX(25deg) rotateY(-6deg) rotateZ(1.5deg) scale(0.96)" 
            : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s",
        }}
      >
        {/* Subtle LED Underglow Glow Effect for Acrylic Case */}
        {caseColor === "acrylic" && (
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-2xl animate-pulse" />
        )}

        {/* Case Screws to simulate a real mechanical keyboard assembly */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-neutral-500 border border-neutral-700 opacity-60 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-neutral-700 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-neutral-500 border border-neutral-700 opacity-60 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-neutral-700 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-neutral-500 border border-neutral-700 opacity-60 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-neutral-700 -rotate-45" />
        </div>
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-neutral-500 border border-neutral-700 opacity-60 shadow-inner flex items-center justify-center">
          <div className="w-1 h-[1px] bg-neutral-700 rotate-45" />
        </div>

        {/* Solid Brass Center Badge */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border border-amber-600 rounded-b text-[8px] font-black uppercase tracking-[0.2em] text-amber-950 shadow-sm flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-amber-900 animate-pulse" />
          LắcKey Custom Est. 2026
        </div>

        {/* Keyboard Inner Plate & Switch gaps */}
        <div
          className="p-2 rounded-2xl flex flex-col transition-colors duration-300"
          style={{
            backgroundColor: plateConfig.color,
            boxShadow: "inset 0 4px 8px rgba(0,0,0,0.2)",
            gap: "var(--key-gap, 3px)",
            transform: is3DActive ? "translateZ(8px)" : "none", // Lift plate off the case base
            transformStyle: "preserve-3d",
          }}
        >

          {rows.map((row, rIdx) => (
            <div 
              key={rIdx} 
              className="flex items-center"
              style={{ gap: "var(--key-gap, 3px)", transformStyle: "preserve-3d" }}
            >
              {row.map((key, kIdx) => {
                // If it is an empty blank spacer
                if (key.type === "blank") {
                  return (
                    <div
                      key={kIdx}
                      style={{
                        width: `calc(${key.w || 1} * var(--key-unit-size, 38px) + (${key.w || 1} - 1) * var(--key-gap, 3px))`,
                        marginLeft: key.xOffset ? `calc(${key.xOffset} * (var(--key-unit-size, 38px) + var(--key-gap, 3px)))` : "0",
                      }}
                      className="h-[var(--key-unit-size,38px)] pointer-events-none"
                    />
                  );
                }

                // Check if this key should be replaced by the rotary encoder knob (TKL or 75% top-right key)
                const isKnob = (layout === "75" && key.code === "Delete") || (layout === "tkl" && key.code === "Pause");

                if (isKnob) {
                  const knobColor = customAccentBg !== "default" ? customAccentBg : "#ea580c";
                  const knobSideColor = adjustColorBrightness(knobColor, -20);
                  const knobWidth = `calc(${key.w} * var(--key-unit-size, 38px) + (${key.w} - 1) * var(--key-gap, 3px))`;

                  return (
                    <div
                      key={kIdx}
                      onClick={handleKnobClick}
                      style={{
                        width: knobWidth,
                        height: "var(--key-unit-size, 38px)",
                        marginLeft: key.xOffset ? `calc(${key.xOffset} * (var(--key-unit-size, 38px) + var(--key-gap, 3px)))` : "0",
                        position: "relative",
                        cursor: "pointer",
                        transformStyle: "preserve-3d",
                        transform: is3DActive ? "translateZ(10px)" : "none",
                      }}
                      className="flex items-center justify-center select-none"
                      title="Núm xoay điều chỉnh âm lượng (Click để vặn)"
                    >
                      {/* Cylindrical Knob Body */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: knobSideColor,
                          transform: `rotate(${knobRotation}deg)`,
                          boxShadow: is3DActive 
                            ? `0 5px 0px 0px ${knobSideColor}, 0 6px 12px rgba(0,0,0,0.4)`
                            : `0 2px 0px 0px ${knobSideColor}, 0 3px 6px rgba(0,0,0,0.3)`,
                          transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s",
                        }}
                        className="relative flex items-center justify-center hover:scale-105 active:scale-95"
                      >
                        {/* Knob Top Face */}
                        <div
                          className="absolute top-[1.5px] left-[1.5px] right-[1.5px] bottom-[3px] rounded-full flex items-center justify-center"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, ${adjustColorBrightness(knobColor, 15)}, ${knobColor})`,
                            boxShadow: "inset 0 1px 0px rgba(255,255,255,0.45), inset 0 -2.5px 0px rgba(0,0,0,0.25)",
                          }}
                        >
                          {/* Rotary indicator dot */}
                          <div className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-white/90 shadow-xs" />
                          {/* Radial texture ring */}
                          <div className="w-4 h-4 rounded-full border border-white/20 opacity-30 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Determine Colors based on type
                const keyType = (keyOverrides && keyOverrides[key.code]) || key.type;
                let bg = themeConfig.alphas;
                let text = themeConfig.legend;
                if (keyType === "mod") {
                  bg = themeConfig.mods;
                  text = themeConfig.modLegend;
                } else if (keyType === "accent") {
                  bg = customAccentBg;
                  text = themeConfig.accentLegend;
                }

                const isActive = activeKeys[key.code];
                const baseColor = adjustColorBrightness(bg, -25);

                // Deep 3D keycap side wall shadow
                const activeTransform = isActive 
                  ? (is3DActive ? "translateY(5px) translateZ(0px)" : "translateY(3px)") 
                  : (is3DActive ? "translateY(0px) translateZ(6px)" : "translateY(0px)");

                const activeShadow = isActive 
                  ? "0 1px 0px 0px rgba(0,0,0,0.1), inset 0 2px 4px rgba(0,0,0,0.4)" 
                  : is3DActive 
                    ? `0 6px 0px 0px ${baseColor}, 0 8px 12px rgba(0,0,0,0.35)`
                    : `0 4px 0px 0px ${baseColor}, 0 5px 10px rgba(0,0,0,0.35)`;

                return (
                  <button
                    key={kIdx}
                    onClick={() => handleKeyClick(key.code)}
                    type="button"
                    style={{
                      width: `calc(${key.w} * var(--key-unit-size, 38px) + (${key.w} - 1) * var(--key-gap, 3px))`,
                      marginLeft: key.xOffset ? `calc(${key.xOffset} * (var(--key-unit-size, 38px) + var(--key-gap, 3px)))` : "0",
                      backgroundColor: baseColor,
                      transform: activeTransform,
                      boxShadow: activeShadow,
                      transition: "transform 0.08s ease, box-shadow 0.08s ease, background-color 0.2s",
                      transformStyle: "preserve-3d",
                    }}
                    className={`h-[var(--key-unit-size,38px)] rounded-[5px] sm:rounded-[6px] text-[9px] sm:text-[10px] font-bold tracking-tighter sm:tracking-normal flex items-center justify-center relative overflow-hidden select-none cursor-pointer`}
                  >
                    {/* Keycap Top Face (Dish) */}
                    <div
                      className="absolute top-[1.5px] left-[1.5px] right-[1.5px] bottom-[3px] rounded-[3px] sm:rounded-[4px] flex items-center justify-center transition-all duration-75"
                      style={{
                        backgroundColor: bg,
                        boxShadow: "inset 0 1px 0px rgba(255,255,255,0.25), inset 0 -1.5px 0px rgba(0,0,0,0.15)",
                      }}
                    >
                      <span style={{ color: text }} className="relative z-10 select-none pointer-events-none font-black tracking-tight">{key.label}</span>
                    </div>
                  </button>
                );

              })}
            </div>
          ))}
        </div>
      </div>

      {/* Typing Sound Instruction Badge */}
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-center text-xs text-neutral-500 font-medium bg-neutral-50 border border-neutral-100 rounded-full px-5 py-2.5 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Trực quan hóa gõ phím trực tiếp:</span>
        </span>
        <kbd className="px-2 py-1 bg-white border border-neutral-200 rounded text-[10px] font-semibold shadow-sm">Gõ bàn phím của bạn</kbd>
        <span>hoặc click các nút trên để nghe thử!</span>
      </div>

      <style jsx global>{`
        :root {
          --key-unit-size: 26px;
          --key-gap: 2px;
        }
        @media (min-width: 480px) {
          :root {
            --key-unit-size: 30px;
            --key-gap: 2px;
          }
        }
        @media (min-width: 640px) {
          :root {
            --key-unit-size: 36px;
            --key-gap: 2px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --key-unit-size: 34px;
            --key-gap: 2px;
          }
        }
        @media (min-width: 1200px) {
          :root {
            --key-unit-size: 40px;
            --key-gap: 3px;
          }
        }
      `}</style>
    </div>
  );
}
