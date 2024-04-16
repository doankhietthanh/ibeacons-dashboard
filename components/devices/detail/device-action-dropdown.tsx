import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Device } from "@/types/devices";
import DeleteDevice from "@/components/devices/detail/delete-device";
import EditDevice from "@/components/devices/detail/edit-device";

enum DialogItem {
  EditDevice,
  DeleteDevice,
}

const DeviceActionsDropdown = ({ device }: { device: Device }) => {
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
                setDialogItem(DialogItem.EditDevice);
              }}
            >
              <DropdownMenuItem className="flex w-full items-center">
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit device</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              className="text-destructive"
              asChild
              onClick={() => {
                setDialogItem(DialogItem.DeleteDevice);
              }}
            >
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete device</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*  Dialog Content */}
      {dialogItem === DialogItem.EditDevice && <EditDevice device={device} />}
      {dialogItem === DialogItem.DeleteDevice && (
        <DeleteDevice device={device} />
      )}
    </Dialog>
  );
};
export default DeviceActionsDropdown;
