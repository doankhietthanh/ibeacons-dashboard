"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { Room } from "@/types/room";
import Image from "next/image";
import { getRoom } from "@/actions/rooms";
import { STATUS_RESPONSE } from "@/constants";
import RoomDetailDropdown from "@/components/rooms/detail/room-detail-dropdown";

const RoomDetailPage = ({ params }: { params: { id: string } }) => {
  const [isPending, startTransition] = useTransition();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const response = await getRoom(params.id);
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setRoom(response.data as Room);
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
        <RoomDetailDropdown room={room} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Image
          src={room.map || ""}
          alt="map"
          width={0}
          height={0}
          className="h-atuo w-full"
          sizes="100vw"
        />
      </div>
    </div>
  );
};

export default RoomDetailPage;
