const SkeletonTiktokFrame = () => {
  return (
    <div className="w-full overflow-hidden border-2 border-[#2d2d2d]">
      <div className="relative w-full h-[420px] bg-neutral-100">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />
        <div className="relative h-full w-full flex items-center justify-center">
          <span className="text-2xl font-mono tracking-wider text-[#2d2d2d]/30 uppercase">TikTok</span>
        </div>
      </div>
    </div>
  );
}

export default SkeletonTiktokFrame;