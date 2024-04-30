import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Tag } from "@/types/tags";
import TagActionsDropdown from "@/components/tags/tag-actions-dropdown";

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "macAddress",
    header: "Mac Address",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("macAddress")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "room",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const room = row.getValue("room");
      // @ts-ignore
      const roomName = room ? room.name : "";
      return <div className="">{roomName}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tag = row.original;
      return <TagActionsDropdown tag={tag} />;
    },
  },
];
