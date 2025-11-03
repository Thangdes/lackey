const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 bg-[#f5f1e8] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-2 border-[#2d2d2d] p-4 flex gap-4 bg-[#f5f1e8]">
              <div className="h-20 w-20 bg-[#d4cfc0] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-[#2d2d2d]/10" />
                <div className="h-3 w-1/2 bg-[#2d2d2d]/10" />
                <div className="h-3 w-1/3 bg-[#2d2d2d]/10" />
              </div>
              <div className="w-24 space-y-2">
                <div className="h-8 w-full bg-[#2d2d2d]/10" />
                <div className="h-8 w-full bg-[#2d2d2d]/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-5 w-28 bg-[#2d2d2d]/10" />
          <div className="h-40 w-full border-2 border-[#2d2d2d] bg-[#f5f1e8] p-4 space-y-3">
            <div className="h-3 w-full bg-[#2d2d2d]/10" />
            <div className="h-3 w-3/4 bg-[#2d2d2d]/10" />
            <div className="h-3 w-2/3 bg-[#2d2d2d]/10" />
          </div>
          <div className="h-10 w-full bg-[#2d2d2d]/10" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
