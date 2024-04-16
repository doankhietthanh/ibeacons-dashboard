import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { Room } from "@/types/room";
import { Form } from "@/components/ui/form";
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

const AddDevices = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateRoomSchema>>({
    resolver: zodResolver(UpdateRoomSchema),
    defaultValues: {},
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
      const result = await roomAction.updateRoom(room.id, values);
      toast({
        title: result.status === "success" ? "Room updated" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add devices</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        {/* TODO: Add input add devices.ts*/}
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

export default AddDevices;
