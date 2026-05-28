export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let out = String(html);
  
  out = out.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*("|')/gi, "");
  return out;
}
