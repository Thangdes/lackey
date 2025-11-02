import Link from "next/link";
import { ROUTES } from "@/constant/route";

export function PageBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 mb-5">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
        <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[#229090] transition-colors">
          Trang chủ
        </Link>
        <span className="text-black font-bold">/</span>
        <span className="text-sm font-bold uppercase tracking-wide text-black">Custom Keychain</span>
      </div>
    </nav>
  );
}
