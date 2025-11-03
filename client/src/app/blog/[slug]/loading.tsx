const Loading = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-6 bg-[#f5f1e8] min-h-screen">
      <div className="h-6 w-3/4 bg-[#2d2d2d]/10 mb-4" />
      <div className="h-3 w-1/3 bg-[#2d2d2d]/10 mb-6" />
      <div className="aspect-video w-full bg-[#d4cfc0] mb-6 border-2 border-[#2d2d2d]">
        <div className="w-full h-full bg-gradient-to-br from-[#c9c4b5] to-[#d4cfc0]" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-[#2d2d2d]/10" />
        ))}
      </div>
    </div>
  );
};

export default Loading;
