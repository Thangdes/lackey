// src/app/robots.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/constant/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/supplier",
          "/supplier/*",
          "/checkout",
          "/checkout/*",
          "/orders",
          "/orders/*",
          "/profile",
          "/profile/*",
          "/cart",
          "/api",
          "/api/*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}