"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import CreateRoomForm from "@/components/rooms/create-room-form";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { Collections } from "@/types/collections";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { Room } from "@/types/room";
import firebase from "@/lib/firebase";

const db = getFirestore(firebase);

const UpdateRoomPage = ({ params }: { params: { id: string } }) => {
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
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{room.name}</h2>
        <p className="text-muted-foreground">Update room details.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CreateRoomForm />
      </div>
    </div>
  );
};

export default UpdateRoomPage;
