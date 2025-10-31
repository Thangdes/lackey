export const cartKeys = {
  all: ["cart"] as const,
  root: () => [...cartKeys.all, "root"] as const,
  items: () => [...cartKeys.all, "items"] as const,
};
