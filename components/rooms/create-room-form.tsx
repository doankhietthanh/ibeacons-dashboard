"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateRoomSchema } from "@/schemas/room";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { RoomAction } from "@/actions/rooms";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_KEY } from "@/constants";

const CreateRoomForm = () => {
  const [backgroundCover, setBackgroundCover] = useState<File | null>(null);
  const [roomMap, setRoomMap] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      id: uuidv4(),
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateRoomSchema>) => {
    startTransition(async () => {
      const roomAction = new RoomAction();
      const result = await roomAction.createRoom(
        values,
        backgroundCover,
        roomMap,
      );
      toast({
        title: result.status === "success" ? "Room created" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_ROOMS);
        router.push(`/rooms/${values.id}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-8"
      >
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundCover"
            render={() => (
              <FormItem>
                <FormLabel>Background Cover</FormLabel>
                <FormDescription>
                  {backgroundCover && (
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={URL.createObjectURL(backgroundCover)}
                        alt="Image"
                        className="h-full w-full rounded-md object-cover"
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </AspectRatio>
                  )}
                </FormDescription>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        setBackgroundCover(event.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8">
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room width (m)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room height (m)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="map"
            render={() => (
              <FormItem>
                <FormLabel>Room Map</FormLabel>
                <FormDescription>
                  {roomMap && (
                    <Image
                      src={URL.createObjectURL(roomMap)}
                      alt="Image"
                      className="h-auto rounded-md object-cover"
                      width={450}
                      height={0}
                      sizes="100vw"
                    />
                  )}
                </FormDescription>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(event) => {
                      if (event.target.files) {
                        setRoomMap(event.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending} type="submit">
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoomForm;
