export function getVideoId(url: string): string | undefined {
  try {
    const m = url.match(/\/video\/(\d+)/);
    return m ? m[1] : undefined;
  } catch {
    return undefined;
  }
}

export type TikTokEmbedOptions = {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  lang?: string;
  playsinline?: boolean;
};

export const DEFAULT_TIKTOK_EMBED_OPTIONS: Required<TikTokEmbedOptions> = {
  autoplay: true,
  muted: true,
  loop: true,
  lang: "vi-VN",
  playsinline: true,
};

export function buildTikTokEmbedUrl(vid: string, opts?: TikTokEmbedOptions): string {
  const o = { ...DEFAULT_TIKTOK_EMBED_OPTIONS, ...(opts ?? {}) };
  const base = `https://www.tiktok.com/embed/v2/${vid}`;
  const u = new URL(base);
  u.searchParams.set("autoplay", o.autoplay ? "1" : "0");
  u.searchParams.set("muted", o.muted ? "1" : "0");
  u.searchParams.set("loop", o.loop ? "1" : "0");
  u.searchParams.set("lang", o.lang);
  u.searchParams.set("playsinline", o.playsinline ? "1" : "0");
  return u.toString();
}

export function isTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return /(^|\.)tiktok\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}
