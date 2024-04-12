"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";
import ItemsSummary from "@/components/dashboard/items-summary";

const DashboardPage = () => {
  return (
    <div className="block space-y-6 py-5 md:p-10">
      <div className="flex items-center justify-between gap-2 sm:flex-row">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="hidden text-muted-foreground md:block">
            Dashboard overview and statistics.
          </p>
        </div>
      </div>
      <Separator className="my-6" />
      <div>
        <ItemsSummary />
      </div>
    </div>
  );
};

export default DashboardPage;
