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

enum RoomDialogItem {
  EditRoom,
  AddMembers,
  AddDevices,
  DeleteRoom,
}

const RoomActionsDropdown = ({ room }: { room: Room }) => {
  const [dialogItem, setRoomDialogItem] = React.useState<RoomDialogItem | null>(
    null,
  );

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
                setRoomDialogItem(RoomDialogItem.EditRoom);
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
                setRoomDialogItem(RoomDialogItem.AddMembers);
              }}
            >
              <DropdownMenuItem>
                <UserRoundPlus className="mr-2 h-4 w-4" />
                <span>Add Members</span>
              </DropdownMenuItem>
            </DialogTrigger>
            {/*<DialogTrigger*/}
            {/*  asChild*/}
            {/*  onClick={() => {*/}
            {/*    setRoomDialogItem(RoomDialogItem.AddDevices);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <PackagePlus className="mr-2 h-4 w-4" />*/}
            {/*    <span>Add Devices</span>*/}
            {/*  </DropdownMenuItem>*/}
            {/*</DialogTrigger>*/}
            <DialogTrigger
              className="text-destructive"
              asChild
              onClick={() => {
                setRoomDialogItem(RoomDialogItem.DeleteRoom);
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
      {dialogItem === RoomDialogItem.EditRoom && <EditRoom room={room} />}
      {dialogItem === RoomDialogItem.AddMembers && <AddMembers room={room} />}
      {dialogItem === RoomDialogItem.AddDevices && <AddDevices room={room} />}
      {dialogItem === RoomDialogItem.DeleteRoom && <DeleteRoom room={room} />}
    </Dialog>
  );
};
export default RoomActionsDropdown;
