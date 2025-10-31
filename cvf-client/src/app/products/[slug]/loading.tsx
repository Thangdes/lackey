const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square w-full rounded-xl bg-gray-200 animate-pulse" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square w-full rounded-md bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-1/3 rounded bg-gray-200 animate-pulse" />
          <div className="h-10 w-40 rounded-md bg-gray-200 animate-pulse" />

          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <div className="h-11 w-32 rounded-md bg-gray-200 animate-pulse" />
            <div className="h-11 w-40 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-12">
        <div className="h-6 w-48 mb-4 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-3 sm:p-4">
              <div className="aspect-square w-full rounded-md bg-gray-200 animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="mt-3 h-5 w-1/3 rounded bg-gray-200 animate-pulse" />
              <div className="mt-3 h-9 w-full rounded-md bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
