const SkeletonTiktokFrame = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl">
      <div className="relative w-full h-[420px]">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-2xl font-semibold">TikTok</span>
        </div>
      </div>
    </div>
  );
}

export default SkeletonTiktokFrame;