"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { STATUS_RESPONSE } from "@/constants";
import { columns } from "@/components/tags/tags-columns";
import ErrorAlert from "@/components/error-alert";
import Loader from "@/components/loader";
import DataTable from "@/components/data-table";
import { TagAction } from "@/actions/tags";
import { Tag } from "@/types/tags";

const TagsPage = () => {
  const [isPending, startTransition] = useTransition();
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    startTransition(async () => {
      const tagAction = new TagAction();
      const response = await tagAction.getTags();
      if (response.status === STATUS_RESPONSE.SUCCESS) {
        setTags(response.data as Tag[]);
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
          <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
          <p className="hidden text-muted-foreground md:block">
            Manage tags and view their status.
          </p>
        </div>
        <Link href="/tags/create">
          <Button variant="default">
            <PlusIcon className="mr-2 h-6 w-6" />
            Create tag
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
        ) : !tags ? (
          <div className="flex h-full w-full items-center justify-center">
            <ErrorAlert message="No tags found." />
          </div>
        ) : (
          <DataTable columns={columns} data={tags} />
        )}
      </div>
    </div>
  );
};

export default TagsPage;
