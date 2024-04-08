import { z } from "zod";

export const CreateRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  backgroundCover: z.string().url().optional(),
  members: z.array(z.string().uuid()).optional(),

  map: z.string().url().optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  stations: z.array(z.string().uuid()).optional(),
  devices: z.array(z.string().uuid()).optional(),
});

export const UpdateRoomSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  backgroundCover: z.string().url().optional(),
  members: z.array(z.string().uuid()).optional(),

  // map: z.string().url().optional(),
  // width: z.coerce.number().min(0).optional(),
  // height: z.coerce.number().min(0).optional(),
  stations: z.array(z.string().uuid()).optional(),
  devices: z.array(z.string().uuid()).optional(),
});
