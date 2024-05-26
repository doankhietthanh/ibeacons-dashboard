"use client";

import { Button } from "@/components/ui/button";
import { StationPosition } from "@/types/stations";
import { TagData, TagPosition } from "@/types/tags";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

export const columns: ColumnDef<TagPosition>[] = [
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
    accessorKey: "stations",
    header: "Stations",
    cell: ({ row }) => {
      const stations = row.getValue("stations") as Record<string, TagData>;
      const raw = row.original.raw as StationPosition[];

      type StationsData = Record<
        string,
        {
          name: string;
          rssi: number;
          txPower: number;
        }
      >;

      const stationsData = Object.keys(stations).reduce(
        (acc, station) => ({
          ...acc,
          [station]: {
            ...stations[station],
            name: raw.find((s) => s.id === station)?.name,
          },
        }),
        {},
      ) as StationsData;

      return (
        <div>
          {Object.keys(stationsData).map((id) => (
            <div className="mb-3 flex flex-col" key={id}>
              <div className="font-medium">{stationsData[id].name}</div>
              <div className="text-muted-foreground">
                RSSI: {stationsData[id].rssi} | TX Power:{" "}
                {stationsData[id].txPower}
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
];
