"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { getAuth } from "firebase/auth";
import firebase from "@/lib/firebase";
import { UpdateDeviceSchema } from "@/schemas/device";
import { Device } from "@/types/devices";
import { DeviceAction } from "@/actions/devices";

const auth = getAuth(firebase);

const EditDevice = ({ device }: { device: Device }) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateDeviceSchema>>({
    resolver: zodResolver(UpdateDeviceSchema),
    defaultValues: {
      name: device.name,
      description: device.description,
    },
  });

  // check permission if user is created the device
  const user = auth.currentUser;
  const userCreatedDevice = device.createdBy;

  if (!user || user?.uid !== userCreatedDevice) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Access Denied</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p>You are not authorized to edit this device.</p>
        </div>
      </DialogContent>
    );
  }

  const onSubmit = async (values: z.infer<typeof UpdateDeviceSchema>) => {
    startTransition(async () => {
      const deviceAction = new DeviceAction();
      const result = await deviceAction.updateDevice(device.id, values);
      toast({
        title: result.status === "success" ? "Device updated" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
      if (result.status === "success") {
        window.location.reload();
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit device</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

          <div className="mt-2 flex w-full justify-end">
            <Button disabled={isPending} type="submit">
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default EditDevice;
