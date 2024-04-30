import React from "react";
import { Separator } from "@/components/ui/separator";
import CreateStationForm from "@/components/stations/create-station-form";

const CreateDevicePage = () => {
  return (
    <div className="block space-y-6 py-5 md:container md:p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Create station</h2>
        <p className="text-muted-foreground">Create a new station.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CreateStationForm />
      </div>
    </div>
  );
};

export default CreateDevicePage;
