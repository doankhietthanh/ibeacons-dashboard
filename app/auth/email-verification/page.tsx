import CardWrapper from "@/components/auth/card-wrapper";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
  return (
    <CardWrapper
      headerTitle="Confim Email"
      headerDescription="Confirming Your Email Address"
      backButtonTitle="Back to Login"
      backButtonHref="/auth/sign-in"
    >
      <NewVerificationForm />
    </CardWrapper>
  );
};

export default NewVerificationPage;
