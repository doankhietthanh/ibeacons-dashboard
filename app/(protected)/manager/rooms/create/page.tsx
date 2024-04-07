import React from "react";
import { Separator } from "@/components/ui/separator";
import CreateRoomForm from "@/components/rooms/create-room-form";

const CreateRoom = () => {
  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create room</h2>
        <p className="text-muted-foreground">
          Create a new room to manage devices.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CreateRoomForm />
      </div>
    </div>
  );
};

export default CreateRoom;
