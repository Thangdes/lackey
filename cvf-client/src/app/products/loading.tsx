import LoadingProduct from "@/components/loading/LoadingProduct";

const Loading = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <LoadingProduct count={12} />
    </div>
  );
};

export default Loading;
