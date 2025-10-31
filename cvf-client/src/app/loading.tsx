import { siteConfig } from "@/constant/site";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
      <div role="status" className="flex items-center gap-5">
        <Image
          src="/logo/logo.jpg"
          alt={siteConfig.name}
          width={96}
          height={96}
          className="rounded-md object-contain"
          priority
        />
        <p className="text-2xl md:text-6xl font-bold tracking-wide text-neutral-900 dark:text-neutral-100 animate-pulse">{siteConfig.name}</p>
      </div>
    </div>
  );
}

export default Loading;
