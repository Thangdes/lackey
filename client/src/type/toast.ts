/**
 * Toast notification types
 */

export type AppToastOptions = {
  title?: string;
  message?: string;
  actionLabel?: string;
  action?: () => void;
  onAction?: () => void;
  duration?: number;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
};

export type AddToCartToastPayload = {
  name: string;
  thumbnailUrl?: string | null;
  quantity?: number;
};
