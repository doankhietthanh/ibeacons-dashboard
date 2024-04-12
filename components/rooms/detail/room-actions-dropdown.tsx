import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  EllipsisVerticalIcon,
  PackagePlus,
  PencilIcon,
  TrashIcon,
  UserRoundPlus,
} from "lucide-react";
import { Room } from "@/types/room";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditRoom from "@/components/rooms/detail/edit-room";
import AddMembers from "@/components/rooms/detail/add-members";
import AddDevices from "@/components/rooms/detail/add-devices";
import DeleteRoom from "@/components/rooms/detail/delete-room";

enum DialogItem {
  EditRoom,
  AddMembers,
  AddDevices,
  DeleteRoom,
}

const RoomActionsDropdown = ({ room }: { room: Room }) => {
  const [dialogItem, setDialogItem] = React.useState<DialogItem | null>(null);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DialogTrigger
              asChild
              onClick={() => {
                setDialogItem(DialogItem.EditRoom);
              }}
            >
              <DropdownMenuItem className="flex w-full items-center">
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit room</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              asChild
              onClick={() => {
                setDialogItem(DialogItem.AddMembers);
              }}
            >
              <DropdownMenuItem>
                <UserRoundPlus className="mr-2 h-4 w-4" />
                <span>Add Members</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              asChild
              onClick={() => {
                setDialogItem(DialogItem.AddDevices);
              }}
            >
              <DropdownMenuItem>
                <PackagePlus className="mr-2 h-4 w-4" />
                <span>Add Devices</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              className="text-destructive"
              asChild
              onClick={() => {
                setDialogItem(DialogItem.DeleteRoom);
              }}
            >
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete Room</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*  Dialog Content */}
      {dialogItem === DialogItem.EditRoom && <EditRoom room={room} />}
      {dialogItem === DialogItem.AddMembers && <AddMembers room={room} />}
      {dialogItem === DialogItem.AddDevices && <AddDevices room={room} />}
      {dialogItem === DialogItem.DeleteRoom && <DeleteRoom room={room} />}
    </Dialog>
  );
};
export default RoomActionsDropdown;
