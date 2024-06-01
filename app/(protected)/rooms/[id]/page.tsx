"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { Room, RoomSettings } from "@/types/room";
import { RoomAction } from "@/actions/rooms";
import { STATUS_RESPONSE } from "@/constants";
import RoomActionsDropdown from "@/components/rooms/detail/room-actions-dropdown";
import dynamic from "next/dynamic";

const RoomMap = dynamic(
  () => import("../../../../components/rooms/detail/room-map"),
  {
    ssr: false,
  },
);

const RoomDetailPage = ({ params }: { params: { id: string } }) => {
  const [isPending, startTransition] = useTransition();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomSettings, setRoomSettings] = useState<RoomSettings | null>(null); // [1
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const roomAction = new RoomAction();
      const response = await roomAction.getRoom(params.id);
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setRoom(response.data as Room);
        // Get room settings
        const settings = await roomAction.getSettings(params.id);
        if (settings.status === STATUS_RESPONSE.SUCCESS) {
          setRoomSettings(settings.data as RoomSettings);
        }
        if (settings.status === STATUS_RESPONSE.ERROR) {
          setError(settings);
        }
      }
      if (response.status === STATUS_RESPONSE.ERROR) {
        setError(response);
      }
    });
  }, [params.id, startTransition]);

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorAlert message={error.message} />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorAlert message="Room not found." />
      </div>
    );
  }

  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="flex items-center justify-between gap-2 sm:flex-row">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{room.name}</h2>
          <p className="hidden text-muted-foreground md:block">
            {room.description}
          </p>
        </div>
        <RoomActionsDropdown room={room} settings={roomSettings} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomMap room={room} settings={roomSettings} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
