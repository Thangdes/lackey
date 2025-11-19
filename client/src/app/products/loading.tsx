import LoadingProduct from "@/components/loading/LoadingProduct";

const Loading = () => {
  return (
    <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16 ">
      <LoadingProduct count={12} />
    </div>
  );
};

export default Loading;
