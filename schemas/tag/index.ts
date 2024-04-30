import { z } from "zod";

export const CreateTagSchema = z.object({
  id: z.string().uuid(),
  macAddress: z.string().min(1, {
    message: "Mac Address is required.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  room: z.string().uuid(),
});

export const UpdateTagSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .optional(),
  description: z.string().optional(),
  room: z.string().uuid().optional(),
});
