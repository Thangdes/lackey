const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-4 flex gap-4">
              <div className="h-20 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="w-24 space-y-2">
                <div className="h-8 w-full rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-full rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-6 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="h-40 w-full rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
