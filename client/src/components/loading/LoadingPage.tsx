import Spinner from "@/components/loading/Spinner";

const LoadingPage = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 py-10 bg-white">
      <Spinner size="lg" className="text-[#2d2d2d]" />
      <div className="w-full max-w-xl space-y-3">
        <div className="h-3 w-2/3 bg-[#2d2d2d]/10" />
        <div className="h-3 w-5/6 bg-[#2d2d2d]/10" />
        <div className="h-3 w-4/6 bg-[#2d2d2d]/10" />
      </div>
    </div>
  );
};

export default LoadingPage;