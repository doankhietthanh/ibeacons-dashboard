"use client";

import React, { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useToast } from "@/components/ui/use-toast";
import { ProfileSchema } from "@/schemas/user";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuth, User } from "firebase/auth";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";
import firebase from "@/lib/firebase";
import { getDownloadURL, getStorage, ref } from "@firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useUpdateProfile } from "react-firebase-hooks/auth";
import { Icons } from "@/components/icons";

type ProfileFormValues = z.infer<typeof ProfileSchema>;

const storage = getStorage(firebase);
const auth = getAuth(firebase);

const ProfileForm = ({ user }: { user: User }) => {
  const storageRef = ref(storage, `users/${user.email}/avatar.jpg`);
  const [uploadFile] = useUploadFile();
  const [updateProfile] = useUpdateProfile(auth);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.displayName || "",
      email: user.email || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        // Upload avatar
        if (selectedAvatar) {
          await uploadFile(storageRef, selectedAvatar, {
            contentType: "image/jpeg",
          });
          setAvatar(await getDownloadURL(storageRef));
        }
        // Update profile
        const updateData = {
          displayName: data.name,
          photoURL: avatar,
        };
        await updateProfile(updateData);
        toast({
          title: "Profile updated successfully.",
          variant: "success",
        });
        setIsEditAvatar(false);
      } catch (e) {
        toast({
          title: "Profile update failed. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-center justify-center ">
        <Avatar className="h-32 w-32">
          {user.photoURL && (
            <AvatarImage src={avatar || user.photoURL} alt="@avatar" />
          )}
          <AvatarFallback>{user.displayName?.at(0)}</AvatarFallback>
        </Avatar>
        {isEditAvatar ? (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="avatar">Upload image</Label>
            <Input
              id="avatar"
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  setSelectedAvatar(event.target.files[0]);
                  setAvatar(URL.createObjectURL(event.target.files[0]));
                }
              }}
            />
          </div>
        ) : (
          <>
            <Button
              size="icon"
              className="absolute bg-transparent"
              onClick={() => {
                setIsEditAvatar(true);
              }}
            >
              <PencilIcon color="#ffffff" />
            </Button>
          </>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or
                  a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} disabled={true} />
                </FormControl>
                <FormDescription>Email cannot be changed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row items-center gap-5">
            <Label>Verify</Label>
            <Badge variant={user.emailVerified ? "default" : "destructive"}>
              {user.emailVerified.toString()}
            </Badge>
          </div>
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update profile
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileForm;
