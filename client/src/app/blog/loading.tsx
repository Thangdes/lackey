const Loading = () => {
  return (
    <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16  bg-[#f5f1e8]">
      <div className="h-6 w-32 bg-[#2d2d2d]/10 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden border-2 border-[#2d2d2d] bg-[#f5f1e8]">
            <div className="aspect-video w-full bg-[#d4cfc0] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#c9c4b5] to-[#d4cfc0]"
                style={{
                  animation: `pulse ${1.5 + (i % 3) * 0.2}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                }}
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-[#2d2d2d]/10" />
              <div className="h-3 w-full bg-[#2d2d2d]/10" />
              <div className="h-3 w-2/3 bg-[#2d2d2d]/10" />
              <div className="h-8 w-24 bg-[#2d2d2d]/10 mt-4" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-8 w-20 bg-[#2d2d2d]/10" />
        <div className="h-8 w-20 bg-[#2d2d2d]/10" />
      </div>
    </div>
  );
};

export default Loading;
