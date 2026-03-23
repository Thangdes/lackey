const LoadingProduct = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative flex flex-col overflow-hidden border-2 border-[#2d2d2d] bg-white">
          <div className="relative w-full pt-[100%] sm:pt-[75%]">
            <div className="absolute inset-0 bg-neutral-100">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200"
                style={{ 
                  animation: `pulse ${1.5 + (i % 3) * 0.2}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                }}
              />
            </div>
            <div className="absolute left-2 top-2 flex gap-2">
              <div className="h-4 w-12 bg-[#2d2d2d]/10" />
              <div className="h-4 w-8 bg-[#2d2d2d]/10" />
            </div>
          </div>
          
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-3 w-4/5 bg-[#2d2d2d]/10" />
            <div className="h-3 w-2/5 bg-[#2d2d2d]/10" />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-4 w-16 bg-[#2d2d2d]/10" />
              <div className="h-3 w-8 bg-[#2d2d2d]/10" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-full bg-[#2d2d2d]/10" />
              <div className="h-8 w-full bg-[#2d2d2d]/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingProduct;