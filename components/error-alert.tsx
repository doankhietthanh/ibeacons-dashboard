import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

interface ErrorAlertProps {
  message: object | string | undefined;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return;

  return (
    <Alert variant="destructive">
      <TriangleAlertIcon className="h-4 w-4" />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        {typeof message === "object" ? message.toString() : message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
