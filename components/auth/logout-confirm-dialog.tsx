"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import AuthAction from "@/actions/auth";
import { cn } from "@/lib/utils";

const LogoutConfirmDialog = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const onSubmit = async () => {
    startTransition(async () => {
      const result = await AuthAction.signOut();
      toast({
        title: result.status === "success" ? "Logout" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      // clear local storage
      localStorage.clear();
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn("hover:bg-transparent hover:underline", className)}
        >
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you logout?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            onClick={() => onSubmit()}
            variant="outline"
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmDialog;
