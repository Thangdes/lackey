import axios from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";

const isServer = typeof window === "undefined";
const AUTH_FLAG_KEY = "auth:hasTokens";
const getAuthFlag = (): boolean => {
  if (isServer) return true;
  try {
    return globalThis.localStorage?.getItem(AUTH_FLAG_KEY) === "1";
  } catch {
    return false;
  }
};
const setAuthFlag = (v: boolean) => {
  if (isServer) return;
  try {
    if (v) globalThis.localStorage?.setItem(AUTH_FLAG_KEY, "1");
    else globalThis.localStorage?.removeItem(AUTH_FLAG_KEY);
  } catch { }
};

if (!isServer) {
  try {
    const hasAuthCookie = (() => {
      try {
        const m = /(?:^|; )hasAuth=([^;]+)/.exec(document.cookie || "");
        return m ? decodeURIComponent(m[1]) : undefined;
      } catch { return undefined; }
    })();
    if (hasAuthCookie === "1") setAuthFlag(true);

    globalThis.addEventListener("auth:login-success", () => setAuthFlag(true));
    globalThis.addEventListener("auth:logout", () => setAuthFlag(false));
    globalThis.addEventListener("auth:refresh-success", () => setAuthFlag(true));
    globalThis.addEventListener("auth:refresh-failed", () => setAuthFlag(false));
  } catch { }
}

export const isLikelyAuthenticated = () => getAuthFlag();
const ensureLeadingSlashOrAbs = (v?: string) => {
  if (!v) return undefined;
  const s = v.replace(/\/$/, "");
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
};

const RAW_PREFIX = process.env.NEXT_INTERNAL_API_PREFIX || "/api/v1";
let API_PREFIX = ensureLeadingSlashOrAbs(RAW_PREFIX) as string;
if (!/^https?:\/\//i.test(API_PREFIX)) {
  if (!API_PREFIX.startsWith("/api/")) {
    API_PREFIX = `/api/${API_PREFIX.replace(/^\/+/, "").replace(/^api\/?/i, "")}`;
  }
}

const PUBLIC_BASE = (() => {
  const rawPublic = process.env.NEXT_PUBLIC_API_BASE || API_PREFIX;
  let normalized = ensureLeadingSlashOrAbs(rawPublic) as string;
  const isAbsolute = /^https?:\/\//i.test(normalized);
  if (!isAbsolute) {
    if (!normalized.startsWith("/api/")) {
      normalized = `/api${normalized.startsWith("/") ? "" : "/"}${normalized.replace(/^\//, "")}`;
    }
  }
  return normalized;
})();
// For SSR: prefer NEXT_INTERNAL_API_BASE (internal/private network URL).
// If not set (e.g. Vercel serverless without Docker), fall back to NEXT_PUBLIC_API_BASE
// if it is an absolute URL (https://...), otherwise fall back to localhost for local dev.
const _internalApiBase = process.env.NEXT_INTERNAL_API_BASE?.replace(/\/$/, "");
const _publicApiBase = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
const SSR_BASE = _internalApiBase
  ? _internalApiBase
  : _publicApiBase && /^https?:\/\//i.test(_publicApiBase)
  ? _publicApiBase
  : "http://localhost:8000";

const ensureTrailingSlash = (v: string) => (v.endsWith('/') ? v : `${v}/`);
// When SSR_BASE is already an absolute URL that contains the API prefix path, don't append API_PREFIX again.
const buildSsrBase = () => {
  if (/^https?:\/\//i.test(SSR_BASE)) {
    // If SSR_BASE already ends with the api prefix path, use as-is
    const prefixPath = API_PREFIX.replace(/^\//,"").replace(/\/$/,"");
    if (SSR_BASE.includes(`/${prefixPath}`)) return SSR_BASE;
    return `${SSR_BASE}${API_PREFIX}`;
  }
  return `${SSR_BASE}${API_PREFIX}`;
};
export const API_BASE = ensureTrailingSlash(isServer ? buildSsrBase() : PUBLIC_BASE);


export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    const status: number = response.status;
    const originalRequest: (AxiosRequestConfig & { _retry?: boolean }) = (config as AxiosRequestConfig) || {};
    const method = String((originalRequest as AxiosRequestConfig)?.method || 'GET').toUpperCase();

    if (status !== 401) return Promise.reject(error);

    const url = String(originalRequest?.url || "");

    // Allow POST to cart endpoints for guest users
    if ((url.startsWith("/cart") || url.includes("/cart/")) && method === 'POST') {
      // Backend handles guest cart - don't reject
      return Promise.resolve(response);
    }

    if (
      url.startsWith("/cart") || url.includes("/cart/") ||
      url.startsWith("/products") || url.includes("/products/") ||
      url.startsWith("/categories") || url.includes("/categories/") ||
      (method === 'GET' && (url.startsWith('/search') || url.includes('/search/'))) ||
      url.includes('/auth/profile') || url.includes('/auth/me')
    ) {
      if (typeof window !== "undefined") {
        try { window.dispatchEvent(new CustomEvent("cart:unauthorized")); } catch { }
      }
      return Promise.reject(error);
    }
    if (
      originalRequest._retry ||
      url.includes("/auth/login") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isServer && !getAuthFlag()) {
        return Promise.reject(error);
      }
      if (!isRefreshing) {
        isRefreshing = true;
        const hdr = originalRequest.headers as unknown as Record<string, unknown> | undefined;
        const cookieHeader =
          (typeof hdr?.Cookie === "string" ? hdr?.Cookie : undefined) ??
          (typeof hdr?.cookie === "string" ? (hdr?.cookie as string) : undefined);
        refreshPromise = api
          .post(
            "/auth/refresh",
            undefined,
            {
              withCredentials: true,
              headers: cookieHeader
                ? {
                  Cookie: cookieHeader,
                }
                : undefined,
            },
          )
          .then(() => { })
          .finally(() => {
            isRefreshing = false;
          });
      }

      await refreshPromise;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:refresh-success"));
      }
      return api.request(originalRequest);
    } catch (e) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
      }
      return Promise.reject(e);
    }
  }
);

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type AxiosErrorLike = { response?: { status?: number; data?: unknown }; message?: string };

function unwrap<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
  return p
    .then((r) => {
      const payload = r.data as unknown;
      if (
        payload &&
        typeof payload === "object" &&
        (payload as { success?: unknown }).success === true &&
        "data" in (payload as Record<string, unknown>)
      ) {
        return (payload as { data: T }).data;
      }
      return r.data;
    })
    .catch((err: unknown) => {
      const e = err as AxiosErrorLike;
      const status = e?.response?.status;
      const data = e?.response?.data as unknown;
      let msg: string | undefined;
      
      // Handle string response
      if (typeof data === "string") {
        msg = data;
      } 
      // Handle object response with message property (NestJS exceptions)
      else if (data && typeof data === "object") {
        const m = (data as { message?: unknown }).message;
        if (Array.isArray(m)) {
          msg = m.join("; ");
        } else if (typeof m === "string") {
          msg = m;
        }
      }
      
      // Fallback to status code or generic message
      if (!msg) msg = status ? `HTTP ${status}` : e?.message || "Request failed";
      throw new Error(msg);
    });
}

const normalizePathForBase = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return path.replace(/^\/+/, "");
};

export const http = {
  get: <T>(path: string, config?: AxiosRequestConfig) => unwrap<T>(api.get<T>(normalizePathForBase(path), config)),
  post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.post<T>(normalizePathForBase(path), body, config)),
  patch: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.patch<T>(normalizePathForBase(path), body, config)),
  put: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(api.put<T>(normalizePathForBase(path), body, config)),
  delete: <T>(path: string, config?: AxiosRequestConfig) => unwrap<T>(api.delete<T>(normalizePathForBase(path), config)),
};

export const httpSuccess = {
  getData: <T>(path: string) => http.get<T>(path),
  postData: <T>(path: string, body?: unknown) => http.post<T>(path, body),
  patchData: <T>(path: string, body?: unknown) => http.patch<T>(path, body),
  putData: <T>(path: string, body?: unknown) => http.put<T>(path, body),
  deleteData: <T>(path: string) => http.delete<T>(path),
};
