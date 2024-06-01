"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Room, RoomSettings as RoomSettingsType } from "@/types/room";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RoomSettingsSchema } from "@/schemas/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoomAction } from "@/actions/rooms";
import { useToast } from "@/components/ui/use-toast";
import { MemberRole } from "@/types/user";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";

const auth = getAuth(firebase);

const RoomSettings = ({
  room,
  settings,
}: {
  room: Room;
  settings: RoomSettingsType | null;
}) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof RoomSettingsSchema>>({
    resolver: zodResolver(RoomSettingsSchema),
    defaultValues: {
      txPower: settings?.txPower || -60,
      nRange: settings?.nRange || 3,
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

  const onSubmit = async (values: z.infer<typeof RoomSettingsSchema>) => {
    startTransition(async () => {
      const roomAction = new RoomAction();
      const result = await roomAction.updateSettings(room.id, values);
      toast({
        title: result.status === "success" ? "Room settings updated" : "Error",
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
        <DialogTitle>Update room settings</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="txPower"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tx Power</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N Range</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={2} max={4} />
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

export default RoomSettings;
