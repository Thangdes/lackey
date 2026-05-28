import { NextRequest, NextResponse } from "next/server";





const RAW_PREFIX = process.env.NEXT_INTERNAL_API_PREFIX || "/api/v1";
const API_PREFIX = `/${RAW_PREFIX.replace(/^\/+/, "").replace(/\/$/, "")}`;

const BACKEND_BASE = (() => {
  const internal = process.env.NEXT_INTERNAL_API_BASE?.replace(/\/$/, "");
  if (internal) return `${internal}${API_PREFIX}`;

  const pub = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  if (pub && /^https?:\/\//i.test(pub)) return pub;

  
  return `http://localhost:8000${API_PREFIX}`;
})();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const upstream = `${BACKEND_BASE}/posts/${encodeURIComponent(slug)}`;
    const res = await fetch(upstream, {
      headers: { "Content-Type": "application/json" },
      
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/blog/:slug] upstream fetch failed:", err);
    return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
  }
}
