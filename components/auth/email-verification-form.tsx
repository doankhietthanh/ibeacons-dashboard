"use client";

import { useCallback, useEffect, useState } from "react";
import { emailActions } from "@/actions/auth/email-actions";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import ErrorAlert from "@/components/error-alert";
import SuccessAlert from "@/components/success-alert";

export const EmailVerificationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");
  const continueUrl = searchParams.get("continueUrl");

  const onSubmit = useCallback(() => {
    if (successMessage || errorMessage) {
      return;
    }

    if (!mode && mode !== "verifyEmail") {
      setErrorMessage("Missing mode parameter or mode is not verifyEmail");
      return;
    }

    if (!actionCode) {
      setErrorMessage("Missing action code parameter");
      return;
    }

    emailActions(mode, actionCode, continueUrl)
      .then((data) => {
        setSuccessMessage(data.success);
        setErrorMessage(data.error);
      })
      .catch(() => {
        setErrorMessage("Something went wrong!");
      });
  }, [mode, actionCode, continueUrl, errorMessage, successMessage]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex items-center justify-center">
      {!successMessage && !errorMessage ? (
        <BeatLoader />
      ) : (
        <>
          <SuccessAlert message={successMessage} />
          <ErrorAlert message={errorMessage} />
        </>
      )}
    </div>
  );
};
