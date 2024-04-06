import CardWrapper from "@/components/auth/card-wrapper";
import { EmailVerificationForm } from "@/components/auth/email-verification-form";

const EmailVerificationPage = () => {
  return (
    <CardWrapper
      headerTitle="Confim Email"
      headerDescription="Confirming Your Email Address"
      backButtonTitle="Back to Login"
      backButtonHref="/auth/sign-in"
    >
      <EmailVerificationForm />
    </CardWrapper>
  );
};

export default EmailVerificationPage;
