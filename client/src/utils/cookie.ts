export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const last = parts.pop()!;
    const v = last.split(";").shift();
    return v ? decodeURIComponent(v) : undefined;
  }
  return undefined;
}
