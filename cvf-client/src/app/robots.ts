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
          "/checkout",
          "/orders",
          "/profile",
          "/cart",
          "/api",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}