import React, { useEffect, useState, useTransition } from "react";

import { Room } from "@/types/room";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import { STATUS_RESPONSE } from "@/constants";
import { getRooms } from "@/actions/rooms";

const RoomsGallery = () => {
  const [isPending, startTransition] = useTransition();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const response = await getRooms();
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setRooms(response.data as Room[]);
      }
      if (response.status === STATUS_RESPONSE.ERROR) {
        setError(response.message);
      }
    });
  }, [startTransition]);

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
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!rooms) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorAlert message="No rooms found." />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-1 justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Link
          href={`/manager/rooms/${room.id}`}
          key={room.id}
          className="w-full cursor-pointer lg:max-w-[400px]"
        >
          <RoomCard room={room as Room} />
        </Link>
      ))}
    </div>
  );
};

export default RoomsGallery;

const RoomCard = ({ room }: { room: Room }) => {
  return (
    <Card>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={room.backgroundCover || ""}
          alt="Image"
          className="h-full w-full rounded-t-md object-cover"
          width={0}
          height={0}
          sizes="100vw"
        />
      </AspectRatio>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription className="h-full w-full truncate">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        Size: {room.width}x{room.height}
      </CardContent>
    </Card>
  );
};
