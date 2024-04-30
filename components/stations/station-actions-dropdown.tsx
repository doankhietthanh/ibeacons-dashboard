import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Station } from "@/types/stations";
import EditStation from "@/components/stations/detail/edit-station";
import DeleteStation from "@/components/stations/detail/delete-station";

enum StationDialogItem {
  EditStation,
  DeleteStation,
}

const StationActionsDropdown = ({ station }: { station: Station }) => {
  const [dialogItem, setStationDialogItem] = useState<StationDialogItem | null>(
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex w-full items-center"
            onClick={() => navigator.clipboard.writeText(station.id)}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            <span>Copy ID</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger
              asChild
              onClick={() => {
                setStationDialogItem(StationDialogItem.EditStation);
              }}
            >
              <DropdownMenuItem className="flex w-full items-center">
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit station</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              className="text-destructive"
              asChild
              onClick={() => {
                setStationDialogItem(StationDialogItem.DeleteStation);
              }}
            >
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete station</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*  Dialog Content */}
      {dialogItem === StationDialogItem.EditStation && (
        <EditStation station={station} />
      )}
      {dialogItem === StationDialogItem.DeleteStation && (
        <DeleteStation station={station} />
      )}
    </Dialog>
  );
};
export default StationActionsDropdown;
