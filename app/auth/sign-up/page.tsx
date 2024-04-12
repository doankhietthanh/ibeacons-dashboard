"use client";

import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { redirect } from "next/navigation";
import { DEFAULT_REDIRECT_PAGE } from "@/routes";
import CardWrapper from "@/components/card-wrapper";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingFullPage from "@/components/loading-full-page";
import ErrorFullPage from "@/components/error-full-page";

const auth = getAuth(firebase);

const SignUpPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingFullPage />;
  }

  if (error) {
    return <ErrorFullPage error={error.message} />;
  }

  if (user) {
    redirect(DEFAULT_REDIRECT_PAGE);
  }

  return (
    <CardWrapper
      headerTitle="Sign Up"
      headerDescription="Create an account to get started"
      backButtonTitle="Already have an account?"
      backButtonHref="/auth/sign-in"
    >
      <SignUpForm />
    </CardWrapper>
  );
};

export default SignUpPage;
