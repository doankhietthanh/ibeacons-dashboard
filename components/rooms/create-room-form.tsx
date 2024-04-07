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

import { getUserCreatedInfo } from "@/common/user";
import firebase from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUploadFile } from "react-firebase-hooks/storage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getDownloadURL, getStorage, ref } from "@firebase/storage";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { setDoc } from "@firebase/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { Collections } from "@/types/collections";
import { Textarea } from "@/components/ui/textarea";

const auth = getAuth(firebase);
const storage = getStorage(firebase);
const db = getFirestore(firebase);

const CreateRoomForm = () => {
  const [user] = useAuthState(auth);
  const [uploadFile] = useUploadFile();

  const [backgroundCover, setBackgroundCover] = useState<File | null>(null);
  const [roomMap, setRoomMap] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      id: uuidv4(),
      backgroundCover: "https://picsum.photos/id/237/200/300",
      map: "https://picsum.photos/id/238/200/300",
      ...getUserCreatedInfo(user),
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateRoomSchema>) => {
    startTransition(async () => {
      try {
        // Upload background cover
        if (backgroundCover) {
          const storageRef = ref(
            storage,
            `rooms/${values.id}/background-cover.jpg`,
          );
          await uploadFile(storageRef, backgroundCover, {
            contentType: "image/jpeg",
          });
          values.backgroundCover = await getDownloadURL(storageRef);
        }
        // Upload room map
        if (roomMap) {
          const storageRef = ref(storage, `rooms/${values.id}/map.jpg`);
          await uploadFile(storageRef, roomMap, {
            contentType: "image/jpeg",
          });
          values.map = await getDownloadURL(storageRef);
        }
        // Create room
        await setDoc(doc(db, Collections.ROOMS, values.id), values);
        toast({
          title: "Created room successfully.",
          variant: "success",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to create room. Please try again.",
          variant: "destructive",
        });
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
            render={({ field }) => (
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
            render={({ field }) => (
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
