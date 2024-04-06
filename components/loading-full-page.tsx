import Loader from "@/components/loader";

const LoadingFullPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader />
    </div>
  );
};

export default LoadingFullPage;
