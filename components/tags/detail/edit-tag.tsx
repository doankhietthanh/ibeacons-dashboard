"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { MemberRole } from "@/types/user";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { Tag } from "@/types/tags";
import { TagAction } from "@/actions/tags";
import { UpdateTagSchema } from "@/schemas/tag";

const auth = getAuth(firebase);

const EditTag = ({ tag }: { tag: Tag }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateTagSchema>>({
    resolver: zodResolver(UpdateTagSchema),
    defaultValues: {
      name: tag.name,
      description: tag.description,
    },
  });

  // check permission if user is the host of the room
  const user = auth.currentUser;
  // get room from tag
  if (tag.room) {
    if (typeof tag.room !== "string") {
      const hostRoomEmail = tag.room.members?.find(
        (member) => member.role === MemberRole.HOST,
      )?.email;

      if (!user || user?.email !== hostRoomEmail) {
        return (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Access Denied</DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p>You are not authorized to edit tag.</p>
            </div>
          </DialogContent>
        );
      }
    }
  }

  const onSubmit = async (values: z.infer<typeof UpdateTagSchema>) => {
    startTransition(async () => {
      const tagAction = new TagAction();
      const result = await tagAction.updateTag(tag.id, {
        ...values,
        room:
          typeof tag.room === "string" ? tag.room : (tag.room?.id as string),
      });
      toast({
        title: result.status === "success" ? "Tag updated" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        window.location.reload();
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit tag</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex w-full justify-end">
            <Button disabled={isPending} type="submit">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default EditTag;
