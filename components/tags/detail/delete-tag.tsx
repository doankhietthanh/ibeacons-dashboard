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
import { Tag } from "@/types/tags";
import { TagAction } from "@/actions/tags";

const auth = getAuth(firebase);

const DeleteTag = ({ tag }: { tag: Tag }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

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
              <p>You are not authorized to delete tag.</p>
            </div>
          </DialogContent>
        );
      }
    }
  }

  const onSubmit = async () => {
    startTransition(async () => {
      const tagAction = new TagAction();
      const result = await tagAction.deleteTag(tag.id);
      toast({
        title: result.status === "success" ? "Tag deleted" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_TAGS);
        window.location.reload();
      }
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you delete tag?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the tag and
          all its data.
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

export default DeleteTag;
