import { Separator } from "@/components/ui/separator";
import React from "react";

const DevicesPage = () => {
  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Devices</h2>
        <p className="text-muted-foreground">
          Manage devices and view their status.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"></div>
    </div>
  );
};

export default DevicesPage;
