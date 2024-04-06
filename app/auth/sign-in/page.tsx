"use client";

import firebase from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { redirect } from "next/navigation";
import { DEFAULT_REDIRECT_PAGE } from "@/routes";
import CardWrapper from "@/components/auth/card-wrapper";
import { SignInForm } from "@/components/auth/sign-in-form";
import LoadingFullPage from "@/components/loading-full-page";
import ErrorFullPage from "@/components/error-full-page";

const auth = getAuth(firebase);

const SignInPage = () => {
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
      headerTitle="Sign In"
      headerDescription="Sign in to your account"
      backButtonTitle="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <SignInForm />
    </CardWrapper>
  );
};

export default SignInPage;
