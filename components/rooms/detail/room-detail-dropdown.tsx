import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, PackagePlus, UserRoundPlus } from "lucide-react";
import EditRoom from "@/components/rooms/detail/edit-room";
import { Room } from "@/types/room";

const RoomDetailDropdown = ({ room }: { room: Room }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              console.log(e);
            }}
          >
            <EditRoom room={room} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UserRoundPlus className="mr-2 h-4 w-4" />
            <span>Add Members</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PackagePlus className="mr-2 h-4 w-4" />
            <span>Add Devices</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default RoomDetailDropdown;
