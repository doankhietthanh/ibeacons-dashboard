import ErrorAlert from "@/components/error-alert";

const ErrorFullPage = ({ error }: { error: string }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <ErrorAlert message={error} />
    </div>
  );
};

export default ErrorFullPage;
