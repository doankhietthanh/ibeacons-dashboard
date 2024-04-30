import { z } from "zod";
import { MemberSchema } from "@/schemas/user";

export const CreateRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  backgroundCover: z.string().url().optional(),
  members: z.array(MemberSchema).optional(),

  map: z.string().url(),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
});

export const UpdateRoomSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  backgroundCover: z.string().url().optional(),
  members: z.array(MemberSchema).optional(),
});
