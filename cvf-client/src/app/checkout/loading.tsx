const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="h-6 w-1/3 rounded bg-gray-200 animate-pulse" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded bg-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-6 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="h-56 w-full rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
