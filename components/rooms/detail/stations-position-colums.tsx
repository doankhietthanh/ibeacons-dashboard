"use client";

import { Button } from "@/components/ui/button";
import { StationPosition } from "@/types/stations";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

export const columns: ColumnDef<StationPosition>[] = [
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
    accessorKey: "x",
    header: "X",
    cell: ({ row }) => <div>{row.getValue("x")}</div>,
  },
  {
    accessorKey: "y",
    header: "Y",
    cell: ({ row }) => <div>{row.getValue("y")}</div>,
  },
];
