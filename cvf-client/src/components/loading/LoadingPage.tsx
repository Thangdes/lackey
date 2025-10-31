import Spinner from "@/components/loading/Spinner";

const LoadingPage = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 py-10">
      <Spinner size="lg" className="text-gray-400" />
      <div className="w-full max-w-xl space-y-3">
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-4/6 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingPage;