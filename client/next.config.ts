import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "down-vn.img.susercontent.com" },
      { protocol: "https", hostname: "img.vietqr.io" },
      { protocol: "https", hostname: "api.vietqr.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.spicezgold.com" },
      { protocol: "https", hostname: "cdn.kphucsinh.vn" },
      { protocol: "https", hostname: "dribbble.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "www.ocado.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const rawPrefix = process.env.NEXT_INTERNAL_API_PREFIX || "/api/v1";
    const prefix = `/${rawPrefix.replace(/^\/+/, "").replace(/\/$/, "")}`;
    const internalBase = (process.env.NEXT_INTERNAL_API_BASE || "http://localhost:8000").replace(/\/$/, "");
    return [
      {
        source: `${prefix}/:path*`,
        destination: `${internalBase}${prefix}/:path*`,
      },
    ];
  },
};

export default nextConfig;