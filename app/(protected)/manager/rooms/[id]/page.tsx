"use client";

import React from "react";

import firebase from "@/lib/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { Collections } from "@/types/collections";
import { Room } from "@/types/room";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

const db = getFirestore(firebase);

const RoomDetailPage = ({ params }: { params: { id: string } }) => {
  const [roomSnapshot, loading, error] = useDocument(
    doc(db, Collections.ROOMS, params.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  if (loading) {
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

  if (!roomSnapshot) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorAlert message="Room not found." />
      </div>
    );
  }

  const room = roomSnapshot.data() as Room;

  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="flex items-center justify-between gap-2 sm:flex-row">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{room.name}</h2>
          <p className="hidden text-muted-foreground md:block">
            {room.description}
          </p>
        </div>
        <Link href={`/manager/rooms/update/${room.id}`}>
          <Button variant="default">
            <PencilIcon className="mr-2 h-6 w-6" />
            Update room
          </Button>
        </Link>
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
