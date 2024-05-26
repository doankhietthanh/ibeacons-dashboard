import React, { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlocksIcon, NetworkIcon, Settings2Icon, TagsIcon } from "lucide-react";
import { MetricsAction } from "@/actions/metrics";
import { Icons } from "@/components/icons";
import { LOCAL_STORAGE_KEY } from "@/constants";

const ItemsSummary = () => {
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalStations, setTotalStations] = useState(0);
  const [totalTags, setTotalTags] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const metricsAction = new MetricsAction();
    startTransition(async () => {
      // Fetch total rooms
      const rooms = await metricsAction.getTotalRooms();
      setTotalRooms(rooms);

      const stations = await metricsAction.getTotalStations();
      setTotalStations(stations);

      const tags = await metricsAction.getTotalTags();
      setTotalTags(tags);

      const devices = await metricsAction.getTotalDevices();
      setTotalDevices(devices);
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
          <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
          <NetworkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{totalStations}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          <TagsIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{totalTags}</div>
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
