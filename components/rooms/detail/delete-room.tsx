import { Room } from "@/types/room";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import RoomAction from "@/actions/rooms";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { BACK_TO_ROOMS_GALLERY } from "@/routes";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { MemberRole } from "@/types/user";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";

const auth = getAuth(firebase);

const DeleteRoom = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

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

  const onSubmit = async () => {
    startTransition(async () => {
      const result = await RoomAction.deleteRoom(room.id);
      toast({
        title: result.status === "success" ? "Room deleted" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_ROOMS);
        router.push(BACK_TO_ROOMS_GALLERY);
      }
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you delete room?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the room
          and all its data.
        </DialogDescription>
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
          variant="destructive"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteRoom;
