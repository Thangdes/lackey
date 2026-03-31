export type ContrastRatio = number;

export interface ContrastResult {
  ratio: ContrastRatio;
  AA: boolean;
  AAA: boolean;
  AALarge: boolean;
  AAALarge: boolean;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): ContrastRatio {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex format like #FFFFFF');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkContrast(
  foreground: string,
  background: string,
  fontSize: number = 16,
  isBold: boolean = false
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);

  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: isLargeText && ratio >= 3,
    AAALarge: isLargeText && ratio >= 4.5,
  };
}

export function getContrastScore(result: ContrastResult): 'AAA' | 'AA' | 'Fail' {
  if (result.AAA || result.AAALarge) return 'AAA';
  if (result.AA || result.AALarge) return 'AA';
  return 'Fail';
}

export const WCAG_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

export interface ColorPalette {
  name: string;
  hex: string;
  rgb: string;
}

export function auditColorCombinations(
  colors: ColorPalette[]
): Array<{
  fg: ColorPalette;
  bg: ColorPalette;
  result: ContrastResult;
  score: string;
}> {
  const results: Array<{
    fg: ColorPalette;
    bg: ColorPalette;
    result: ContrastResult;
    score: string;
  }> = [];

  for (const fg of colors) {
    for (const bg of colors) {
      if (fg.name === bg.name) continue;

      const result = checkContrast(fg.hex, bg.hex);
      const score = getContrastScore(result);

      results.push({ fg, bg, result, score });
    }
  }

  return results.sort((a, b) => b.result.ratio - a.result.ratio);
}

export function generateContrastReport(
  colors: ColorPalette[]
): {
  total: number;
  passing: number;
  failing: number;
  combinations: ReturnType<typeof auditColorCombinations>;
} {
  const combinations = auditColorCombinations(colors);
  const passing = combinations.filter((c) => c.score !== 'Fail').length;
  const failing = combinations.filter((c) => c.score === 'Fail').length;

  return {
    total: combinations.length,
    passing,
    failing,
    combinations,
  };
}

export function suggestAccessibleColor(
  foreground: string,
  background: string,
  targetRatio: number = WCAG_RATIOS.AA_NORMAL
): string | null {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return null;

  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const adjustColor = (value: number, factor: number): number => {
    return Math.max(0, Math.min(255, value * factor));
  };

  const factor = bgLum > 0.5 ? 0.5 : 1.5;
  const newR = Math.round(adjustColor(fgRgb.r, factor));
  const newG = Math.round(adjustColor(fgRgb.g, factor));
  const newB = Math.round(adjustColor(fgRgb.b, factor));

  const suggestedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  
  const resultingRatio = getContrastRatio(suggestedColor, background);
  if (resultingRatio >= targetRatio) {
    return suggestedColor;
  }

  return null;
}
