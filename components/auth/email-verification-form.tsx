"use client";

import { newVerification } from "@/actions/auth/email-verification";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import ErrorAlert from "@/components/auth/error-alert";
import SuccessAlert from "@/components/auth/success-alert";

export const NewVerificationForm = () => {
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

    if (!mode) {
      setErrorMessage("Missing mode parameter");
      return;
    }

    if (!actionCode) {
      setErrorMessage("Missing action code parameter");
      return;
    }

    newVerification(mode, actionCode, continueUrl)
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
