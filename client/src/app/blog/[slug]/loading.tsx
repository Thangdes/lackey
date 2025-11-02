const Loading = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="aspect-video w-full rounded-xl bg-gray-200 animate-pulse mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default Loading;
