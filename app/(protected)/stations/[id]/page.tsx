"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { STATUS_RESPONSE } from "@/constants";
import { Station } from "@/types/stations";
import { StationAction } from "@/actions/stations";

const StationDetailPage = ({ params }: { params: { id: string } }) => {
  const [isPending, startTransition] = useTransition();
  const [station, setStation] = useState<Station | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const stationAction = new StationAction();
      const response = await stationAction.getStation(params.id);
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setStation(response.data as Station);
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

  if (!station) {
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
          <h2 className="text-2xl font-bold tracking-tight">{station.name}</h2>
          <p className="hidden text-muted-foreground md:block">
            ID: {station.id}
          </p>
        </div>
        {/*<StationActionsDropdown station={station} />*/}
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/*<StationController station={station} />*/}
      </div>
    </div>
  );
};

export default StationDetailPage;
