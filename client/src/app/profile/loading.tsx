const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-gray-200 animate-pulse" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main list */}
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-200 animate-pulse" />
          ))}
          <div className="mt-4 flex items-center justify-end gap-2">
            <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-3">
          <div className="h-10 w-2/3 rounded-md bg-gray-200 animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
