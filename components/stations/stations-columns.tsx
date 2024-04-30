"use client";

import { Button } from "@/components/ui/button";
import { Station } from "@/types/stations";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import StationActionsDropdown from "@/components/stations/station-actions-dropdown";

export const columns: ColumnDef<Station>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
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
    cell: ({ row }) => {
      const station = row.original;
      return <StationActionsDropdown station={station} />;
    },
    enableHiding: false,
    id: "actions",
  },
];
