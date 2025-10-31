export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let out = String(html);
  // Remove script and style tags and their content
  out = out.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  // Remove event handler attributes like onclick="..."
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Remove javascript: URLs
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*("|')/gi, "");
  return out;
}
