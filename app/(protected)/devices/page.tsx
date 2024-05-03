"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Device } from "@/types/devices";
import { DeviceAction } from "@/actions/devices";
import { STATUS_RESPONSE } from "@/constants";
import { columns } from "@/components/devices/devices-columns";
import ErrorAlert from "@/components/error-alert";
import Loader from "@/components/loader";
import DataTable from "@/components/data-table";

const DevicesPage = () => {
  const [isPending, startTransition] = useTransition();
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const deviceAction = new DeviceAction();
      const response = await deviceAction.getDevices();
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setDevices(response.data as Device[]);
      }
      if (response.status === STATUS_RESPONSE.ERROR) {
        setError(response.message);
      }
    });
  }, [startTransition]);

  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="flex items-center justify-between gap-2 sm:flex-row">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Devices</h2>
          <p className="hidden text-muted-foreground md:block">
            Manage devices and view their status.
          </p>
        </div>
        <Link href="/devices/create">
          <Button variant="default">
            <PlusIcon className="mr-2 h-6 w-6" />
            Create device
          </Button>
        </Link>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex h-full w-full items-center justify-center">
            <ErrorAlert message={error} />
          </div>
        ) : !devices ? (
          <div className="flex h-full w-full items-center justify-center">
            <ErrorAlert message="No devices found." />
          </div>
        ) : (
          <DataTable columns={columns} data={devices} />
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
