import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import RoomsGallery from "@/components/rooms/rooms-gallery";

const RoomsPage = () => {
  return (
    <div className="block space-y-6 py-5 md:p-10">
      <div className="flex items-center justify-between gap-2 sm:flex-row">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Rooms</h2>
          <p className="hidden text-muted-foreground md:block">
            Manage rooms and view their status.
          </p>
        </div>
        <Link href="/rooms/create">
          <Button variant="default">
            <PlusIcon className="mr-2 h-6 w-6" />
            Create room
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomsGallery />
      </div>
    </div>
  );
};

export default RoomsPage;
