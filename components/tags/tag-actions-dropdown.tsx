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
import { Tag } from "@/types/tags";
import EditTag from "@/components/tags/detail/edit-tag";
import DeleteTag from "@/components/tags/detail/delete-tag";

enum TagDialogItem {
  EditTag,
  DeleteTag,
}

const TagActionsDropdown = ({ tag }: { tag: Tag }) => {
  const [dialogItem, setTagDialogItem] = useState<TagDialogItem | null>(null);

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
            onClick={() => navigator.clipboard.writeText(tag.macAddress)}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            <span>Copy Mac Address</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger
              asChild
              onClick={() => {
                setTagDialogItem(TagDialogItem.EditTag);
              }}
            >
              <DropdownMenuItem className="flex w-full items-center">
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit tag</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger
              className="text-destructive"
              asChild
              onClick={() => {
                setTagDialogItem(TagDialogItem.DeleteTag);
              }}
            >
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete tag</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*  Dialog Content */}
      {dialogItem === TagDialogItem.EditTag && <EditTag tag={tag} />}
      {dialogItem === TagDialogItem.DeleteTag && <DeleteTag tag={tag} />}
    </Dialog>
  );
};
export default TagActionsDropdown;
