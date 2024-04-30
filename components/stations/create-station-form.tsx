"use client";

import React, { useEffect, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CreateStationSchema } from "@/schemas/station";
import { Room } from "@/types/room";
import { RoomAction } from "@/actions/rooms";
import { LOCAL_STORAGE_KEY, STATUS_RESPONSE } from "@/constants";
import { StationAction } from "@/actions/stations";

const CreateStationForm = () => {
  const [isPending, startTransition] = useTransition();
  const [rooms, setRooms] = useState<Room[] | undefined>([]);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreateStationSchema>>({
    resolver: zodResolver(CreateStationSchema),
  });

  const onSubmit = async (values: z.infer<typeof CreateStationSchema>) => {
    startTransition(async () => {
      const stationAction = new StationAction();
      const result = await stationAction.createStation(values);
      toast({
        title: result.status === "success" ? "Station created" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOTAL_STATIONS);
        router.push(`/stations`);
      }
    });
  };

  useEffect(() => {
    const roomAction = new RoomAction();
    roomAction.getRooms().then((result) => {
      if (result.status == STATUS_RESPONSE.SUCCESS) {
        setRooms(result.data);
      }
    });
  }, [rooms]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full max-w-[400px] grid-cols-1 gap-8"
      >
        <div className="w-full space-y-8">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room which device is being use" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms?.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateStationForm;
