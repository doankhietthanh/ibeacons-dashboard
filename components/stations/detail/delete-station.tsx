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
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { MemberRole } from "@/types/user";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { Station } from "@/types/stations";
import { StationAction } from "@/actions/stations";

const auth = getAuth(firebase);

const DeleteStation = ({ station }: { station: Station }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  // check permission if user is the host of the room
  const user = auth.currentUser;
  // get room from station
  if (station.room) {
    if (typeof station.room !== "string") {
      const hostRoomEmail = station.room.members?.find(
        (member) => member.role === MemberRole.HOST,
      )?.email;

      if (!user || user?.email !== hostRoomEmail) {
        return (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Access Denied</DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p>You are not authorized to delete station.</p>
            </div>
          </DialogContent>
        );
      }
    }
  }

  const onSubmit = async () => {
    startTransition(async () => {
      const stationAction = new StationAction();
      const result = await stationAction.deleteStation(station.id);
      toast({
        title: result.status === "success" ? "Station deleted" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_STATIONS);
        window.location.reload();
      }
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you delete station?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the station
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

export default DeleteStation;
