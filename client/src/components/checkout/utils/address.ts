export function canChooseDistrict(city: string): boolean {
  const s = (city || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
  return s.includes("ho chi minh");
}
