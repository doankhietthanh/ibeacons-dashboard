import React, { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlocksIcon, Settings2Icon } from "lucide-react";
import MetricsAction from "@/actions/metrics";
import { Icons } from "@/components/icons";
import { LOCAL_STORAGE_KEY } from "@/constants";

const ItemsSummary = () => {
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      // Fetch total rooms
      let rooms: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_ROOMS,
      );
      if (rooms) {
        setTotalRooms(parseInt(rooms));
      } else {
        rooms = await MetricsAction.getTotalRooms();
        setTotalRooms(rooms);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOTAL_ROOMS, rooms.toString());
      }
      // Fetch total devices.ts
      let devices: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_DEVICES,
      );
      if (devices) {
        setTotalDevices(parseInt(devices));
      } else {
        devices = await MetricsAction.getTotalDevices();
        setTotalDevices(devices);
        localStorage.setItem(
          LOCAL_STORAGE_KEY.TOTAL_DEVICES,
          devices.toString(),
        );
      }
    });
  }, [startTransition]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          <BlocksIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{totalRooms}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <Settings2Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{totalDevices}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemsSummary;
