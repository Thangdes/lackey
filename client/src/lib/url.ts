import { siteConfig } from "@/constant/site";

export const absoluteUrl = (path = "/") => {
  const base = siteConfig.url;
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const getCanonical = (pathname = "/") =>
  new URL(pathname, siteConfig.url).toString();
