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
      let rooms: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_ROOMS,
      );
      if (rooms) {
        setTotalRooms(parseInt(rooms));
      } else {
        rooms = await metricsAction.getTotalRooms();
        setTotalRooms(rooms);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOTAL_ROOMS, rooms.toString());
      }
      // Fetch total stations
      let stations: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_STATIONS,
      );
      if (stations) {
        setTotalStations(parseInt(stations));
      } else {
        stations = await metricsAction.getTotalStations();
        setTotalStations(stations);
        localStorage.setItem(
          LOCAL_STORAGE_KEY.TOTAL_STATIONS,
          stations.toString(),
        );
      }
      // Fetch total tags
      let tags: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_TAGS,
      );
      if (tags) {
        setTotalTags(parseInt(tags));
      } else {
        tags = await metricsAction.getTotalTags();
        setTotalTags(tags);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOTAL_TAGS, tags.toString());
      }
      // Fetch total devices.
      let devices: string | number | null = localStorage.getItem(
        LOCAL_STORAGE_KEY.TOTAL_DEVICES,
      );
      if (devices) {
        setTotalDevices(parseInt(devices));
      } else {
        devices = await metricsAction.getTotalDevices();
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
