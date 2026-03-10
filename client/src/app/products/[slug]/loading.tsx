const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square w-full border-2 border-[#2d2d2d] bg-neutral-100">
            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square w-full border-2 border-[#2d2d2d] bg-neutral-100" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-[#2d2d2d]/10" />
          <div className="h-4 w-1/3 bg-[#2d2d2d]/10" />
          <div className="h-8 w-32 bg-[#2d2d2d]/10" />

          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-[#2d2d2d]/10" />
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <div className="h-10 w-28 border-2 border-[#2d2d2d] bg-[#2d2d2d]/10" />
            <div className="h-10 w-36 border-2 border-[#2d2d2d] bg-[#2d2d2d]/10" />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="h-5 w-40 mb-6 bg-[#2d2d2d]/10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-2 border-[#2d2d2d] p-3 sm:p-4 bg-white">
              <div className="aspect-square w-full bg-neutral-100" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-5/6 bg-[#2d2d2d]/10" />
                <div className="h-3 w-2/3 bg-[#2d2d2d]/10" />
              </div>
              <div className="mt-3 h-4 w-1/3 bg-[#2d2d2d]/10" />
              <div className="mt-3 h-8 w-full bg-[#2d2d2d]/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
