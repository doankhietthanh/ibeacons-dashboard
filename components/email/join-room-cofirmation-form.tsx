"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import ErrorAlert from "@/components/error-alert";
import SuccessAlert from "@/components/success-alert";
import { RoomAction } from "@/actions/rooms";
import { STATUS_RESPONSE } from "@/constants";

const JoinRoomConfirmationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const email = searchParams.get("email");

  const onSubmit = useCallback(async () => {
    if (successMessage || errorMessage) {
      return;
    }

    if (!roomId || !email) {
      setErrorMessage("Missing room id parameter or email is not provided");
      return;
    }
    
    const roomAction = new RoomAction();
    const result = await roomAction.joinRoom(roomId, email);
    if (result.status === STATUS_RESPONSE.SUCCESS) {
      setSuccessMessage(result.message as string);
      localStorage.clear();
    } else {
      setErrorMessage(result.message as string);
    }
  }, [roomId, email, errorMessage, successMessage]);

  useEffect(() => {
    onSubmit().then(() => {});
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

export default JoinRoomConfirmationForm;
