"use client";

import CardWrapper from "@/components/card-wrapper";
import JoinRoomConfirmationForm from "@/components/email/join-room-cofirmation-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import LoadingFullPage from "@/components/loading-full-page";
import ErrorFullPage from "@/components/error-full-page";
import React from "react";
import ErrorAlert from "@/components/error-alert";

const auth = getAuth(firebase);

const JoinRoomConfirmationPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingFullPage />;
  }

  if (error) {
    return <ErrorFullPage error={error.message} />;
  }

  if (!user) {
    return (
      <CardWrapper
        headerTitle="Join Room Confirmation"
        headerDescription="Confirming Your Email Address"
        backButtonTitle="Go to sign in"
        backButtonHref="/auth/sign-in"
      >
        <ErrorAlert message="You must sign in after confirm" />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerTitle="Join Room Confirmation"
      headerDescription="Confirming Your Email Address"
      backButtonTitle="Back to dashboard"
      backButtonHref="/"
    >
      <JoinRoomConfirmationForm />
    </CardWrapper>
  );
};

export default JoinRoomConfirmationPage;
