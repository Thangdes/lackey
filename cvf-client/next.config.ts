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