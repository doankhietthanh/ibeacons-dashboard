import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackButton from "@/components/back-button";
import Logo from "@/components/logo";

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  headerDescription?: string;
  backButtonTitle: string;
  backButtonHref: string;
}

const CardWrapper = ({
  children,
  headerTitle,
  headerDescription,
  backButtonTitle,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="mx-auto flex w-full flex-col justify-center sm:w-[400px]">
      <CardHeader className="flex w-full items-center justify-center gap-2">
        <Logo />
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex w-full flex-col items-center justify-center gap-2">
        <BackButton title={backButtonTitle} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
