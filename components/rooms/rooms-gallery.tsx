import React from "react";

import firebase from "@/lib/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, query, where } from "@firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { Collections } from "@/types/collections";

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
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(firebase);
const db = getFirestore(firebase);

const RoomsGallery = () => {
  const [user, authLoading, authError] = useAuthState(auth);
  const [rooms, dbLoading, dbError] = useCollection(
    query(
      collection(db, Collections.ROOMS),
      where("createdBy", "==", user?.uid),
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  if (authLoading || dbLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (authError || dbError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorAlert message={authError?.message || dbError?.message} />
      </div>
    );
  }

  console.log(rooms);
  return (
    <div className="flex h-full w-full items-center justify-center md:justify-start">
      {rooms &&
        rooms.docs.map((doc) => (
          <Link
            href={`/manager/rooms/${doc.id}`}
            key={doc.id}
            className="w-full cursor-pointer md:w-[400px]"
          >
            <RoomCard room={doc.data() as Room} />
          </Link>
        ))}
    </div>
  );
};

export default RoomsGallery;

const RoomCard = ({ room }: { room: Room }) => {
  console.log(room);
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
      </CardHeader>
      <CardDescription>{room.description}</CardDescription>
      <CardContent>
        Size: {room.width}x{room.height}
      </CardContent>
    </Card>
  );
};
