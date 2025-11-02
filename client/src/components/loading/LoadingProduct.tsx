const LoadingProduct = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          {/* image */}
          <div className="relative w-full pt-[100%] sm:pt-[75%]">
            <div className="absolute inset-0 h-full w-full rounded-t-2xl bg-gray-200 animate-pulse" />
            {/* badges */}
            <div className="absolute left-2 top-2 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-200/80 animate-pulse" />
              <div className="h-5 w-12 rounded-full bg-gray-200/80 animate-pulse" />
            </div>
          </div>
          {/* content */}
          <div className="p-3 sm:p-4">
            <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
            <div className="mt-3 flex items-center gap-2">
              <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-9 w-full rounded-full bg-gray-200 animate-pulse" />
              <div className="h-9 w-full rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingProduct;