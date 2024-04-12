"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SocialAuthAction from "@/actions/auth/social";

interface SocialLoginFormProps {
  isPending: boolean;
}

const SocialLoginForm = ({ isPending }: SocialLoginFormProps) => {
  const { toast } = useToast();
  const handleSignInWithGoogle = async () => {
    const result = await SocialAuthAction.signInWithGoogle();
    toast({
      title: result.status === "success" ? "Sign In" : "Error",
      description: result.message as string,
      variant: result.status === "success" ? "success" : "destructive",
    });
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          className="w-full"
          onClick={async () => {
            await handleSignInWithGoogle();
          }}
        >
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>
    </>
  );
};

export default SocialLoginForm;
