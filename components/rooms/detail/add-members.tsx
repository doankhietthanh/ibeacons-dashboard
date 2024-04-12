import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, useTransition } from "react";
import { Room } from "@/types/room";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import { Member, MemberRole, MemberStatus } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import RoomAction from "@/actions/rooms";
import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { sendEmailJoinRoomConfirm } from "@/lib/mail";

const auth = getAuth(firebase);

const AddMembers = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>(room.members || []);

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
    await sendConfirmationEmail();
    startTransition(async () => {
      const result = await RoomAction.updateRoom(room.id, {
        members,
      });
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

  const addMember = (email: string) => {
    // verify format of email
    if (!email || !email.match(/\S+@\S+\.\S+/)) {
      setEmailError("Invalid email format");
      return;
    }
    if (members.find((member) => member.email === email)) {
      setEmailError("Member already exists");
      return;
    }
    setMembers([
      ...members,
      {
        email: email,
        role: MemberRole.MEMBER,
        status: MemberStatus.INACTIVE,
      },
    ]);
  };

  const deleteMember = (email: string) => {
    // not allow delete host
    if (
      members.find((member) => member.email === email)?.role === MemberRole.HOST
    ) {
      toast({
        title: "Error",
        description: "Cannot delete host",
        variant: "destructive",
      });
      return;
    }
    setMembers(members.filter((member) => member.email !== email));
  };

  const sendConfirmationEmail = async () => {
    const pendingMembers = members.filter(
      (member) => member.status === MemberStatus.INACTIVE,
    );
    if (!pendingMembers.length) {
      return;
    }
    pendingMembers.map(async (member) => {
      await sendEmailJoinRoomConfirm(
        member.email,
        room.id,
        room.name,
        hostRoomEmail as string,
      );
    });
    toast({
      title: "Email sent",
      description:
        "Confirmation email sent to members: " +
        pendingMembers.map((member) => member.email).join(", "),
      variant: "default",
    });
    return;
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add members</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="flex gap-2">
          <Input
            type="email"
            onChange={(e) => {
              setEmailError(null);
              setEmail(e.target.value);
            }}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              addMember(email);
            }}
          >
            <PlusIcon />
          </Button>
        </div>
        {emailError && <div className="text-sm text-red-500">{emailError}</div>}
      </div>
      {members.length > 0 && (
        <div className="mt-4">
          <Label>Members</Label>
          <ul className="mt-2 space-y-2">
            {members.map((member) => (
              <li
                key={member.email}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex space-x-2">
                  <div className="w-[240px] truncate">{member.email}</div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    deleteMember(member.email);
                  }}
                >
                  <TrashIcon width={16} height={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-2 flex w-full justify-end">
        <Button disabled={isPending} onClick={() => onSubmit()}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </DialogContent>
  );
};

export default AddMembers;
