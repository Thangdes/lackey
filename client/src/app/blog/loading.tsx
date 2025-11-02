const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="aspect-video w-full bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
        <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
};

export default Loading;
