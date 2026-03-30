"use client";

import { useState, useEffect } from "react";
import { isLikelyAuthenticated } from "@/utils/http";

export function useIsAuthenticated(): boolean {
  const [isAuth, setIsAuth] = useState<boolean>(() => isLikelyAuthenticated());

  useEffect(() => {
    setIsAuth(isLikelyAuthenticated());

    const onLogin = () => setIsAuth(true);
    const onLogout = () => setIsAuth(false);
    const onRefreshSuccess = () => setIsAuth(true);
    const onRefreshFailed = () => setIsAuth(false);

    window.addEventListener("auth:login-success", onLogin);
    window.addEventListener("auth:logout", onLogout);
    window.addEventListener("auth:refresh-success", onRefreshSuccess);
    window.addEventListener("auth:refresh-failed", onRefreshFailed);

    return () => {
      window.removeEventListener("auth:login-success", onLogin);
      window.removeEventListener("auth:logout", onLogout);
      window.removeEventListener("auth:refresh-success", onRefreshSuccess);
      window.removeEventListener("auth:refresh-failed", onRefreshFailed);
    };
  }, []);

  return isAuth;
}
