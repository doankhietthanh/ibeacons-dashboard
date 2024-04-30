"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Separator } from "@/components/ui/separator";
import Loader from "@/components/loader";
import ErrorAlert from "@/components/error-alert";
import { STATUS_RESPONSE } from "@/constants";
import { Device } from "@/types/devices";
import { DeviceAction } from "@/actions/devices";
import DeviceController from "@/components/devices/detail/device-controller";
import DeviceActionsDropdown from "@/components/devices/detail/device-action-dropdown";

const DeviceDetailPage = ({ params }: { params: { id: string } }) => {
  const [isPending, startTransition] = useTransition();
  const [device, setDevice] = useState<Device | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const deviceAction = new DeviceAction();
      const response = await deviceAction.getDevice(params.id);
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setDevice(response.data as Device);
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

  if (!device) {
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
          <h2 className="text-2xl font-bold tracking-tight">{device.name}</h2>
          <p className="hidden text-muted-foreground md:block">
            ID: {device.id}
          </p>
        </div>
        <DeviceActionsDropdown device={device} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DeviceController device={device} />
      </div>
    </div>
  );
};

export default DeviceDetailPage;
