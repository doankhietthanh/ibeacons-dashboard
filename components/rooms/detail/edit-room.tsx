"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Room } from "@/types/room";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateRoomSchema } from "@/schemas/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoomAction } from "@/actions/rooms";
import { useToast } from "@/components/ui/use-toast";
import { MemberRole } from "@/types/user";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";

const auth = getAuth(firebase);

const EditRoom = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();
  const [backgroundCover, setBackgroundCover] = useState<File | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateRoomSchema>>({
    resolver: zodResolver(UpdateRoomSchema),
    defaultValues: {
      name: room.name,
      description: room.description,
      backgroundCover: room.backgroundCover as string,
    },
  });

  // check permission if user is the host of the room
  const user = auth.currentUser;
  const hostRoomEmail = room.members?.find(
    (member) => member.role === MemberRole.HOST,
  )?.email;

  if (!user || user?.email !== hostRoomEmail) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access Denied</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p>You are not authorized to add members to this room.</p>
        </div>
      </DialogContent>
    );
  }

  const onSubmit = async (values: z.infer<typeof UpdateRoomSchema>) => {
    startTransition(async () => {
      const roomAction = new RoomAction();
      const result = await roomAction.updateRoom(
        room.id,
        values,
        backgroundCover,
      );
      toast({
        title: result.status === "success" ? "Room updated" : "Error",
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
        <DialogTitle>Edit room</DialogTitle>
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
          <FormField
            control={form.control}
            name="backgroundCover"
            render={() => (
              <FormItem>
                <FormLabel>Background Cover</FormLabel>
                <FormDescription>
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={
                        backgroundCover
                          ? URL.createObjectURL(backgroundCover as File)
                          : (room.backgroundCover as string) || ""
                      }
                      alt="Image"
                      className="h-full w-full rounded-md object-cover"
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </AspectRatio>
                </FormDescription>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        setBackgroundCover(event.target.files[0]);
                      }
                    }}
                  />
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

export default EditRoom;
