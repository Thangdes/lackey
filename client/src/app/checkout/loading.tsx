const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-5 w-32 bg-[#2d2d2d]/10" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-[#2d2d2d]/10 border-2 border-[#2d2d2d]" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-5 w-24 bg-[#2d2d2d]/10" />
          <div className="h-56 w-full border-2 border-[#2d2d2d] bg-white p-4 space-y-3">
            <div className="h-4 w-full bg-[#2d2d2d]/10" />
            <div className="h-3 w-3/4 bg-[#2d2d2d]/10" />
            <div className="h-3 w-2/3 bg-[#2d2d2d]/10" />
            <div className="h-3 w-1/2 bg-[#2d2d2d]/10" />
          </div>
          <div className="h-10 w-full bg-[#2d2d2d]/10" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
