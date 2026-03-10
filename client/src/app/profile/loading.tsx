const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white min-h-screen">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 border-2 border-[#2d2d2d] bg-neutral-100" />
        <div className="flex-1">
          <div className="h-4 w-40 bg-[#2d2d2d]/10 mb-2" />
          <div className="h-3 w-60 bg-[#2d2d2d]/10" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 border-2 border-[#2d2d2d] bg-[#2d2d2d]/10" />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 border-2 border-[#2d2d2d] bg-white" />
          ))}
          <div className="mt-4 flex items-center justify-end gap-2">
            <div className="h-8 w-20 bg-[#2d2d2d]/10" />
            <div className="h-8 w-20 bg-[#2d2d2d]/10" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-8 w-2/3 bg-[#2d2d2d]/10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 border-2 border-[#2d2d2d] bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
