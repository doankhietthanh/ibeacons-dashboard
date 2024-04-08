import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useTransition } from "react";
import { PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Room } from "@/types/room";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateRoomSchema } from "@/schemas/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRoom } from "@/actions/rooms";
import { useToast } from "@/components/ui/use-toast";

const EditRoom = ({ room }: { room: Room }) => {
  const [isPending, startTransition] = useTransition();
  const [backgroundCover, setBackgroundCover] = useState<File | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateRoomSchema>>({
    resolver: zodResolver(UpdateRoomSchema),
    defaultValues: {
      name: room.name,
      description: room.description,
      backgroundCover: room.backgroundCover,
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateRoomSchema>) => {
    startTransition(async () => {
      const result = await updateRoom(room.id, values, backgroundCover);
      toast({
        title: result.status === "success" ? "Room updated" : "Error",
        description: result.message as string,
        variant: result.status === "success" ? "success" : "destructive",
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center">
        <PencilIcon className="mr-2 h-4 w-4" />
        <span>Edit room</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
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
            <FormField
              control={form.control}
              name="backgroundCover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Cover</FormLabel>
                  <FormDescription>
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={
                          backgroundCover
                            ? URL.createObjectURL(backgroundCover)
                            : room.backgroundCover || ""
                        }
                        alt="Image"
                        className="h-full w-full rounded-md object-cover"
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </AspectRatio>
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
    </Dialog>
  );
};

export default EditRoom;
