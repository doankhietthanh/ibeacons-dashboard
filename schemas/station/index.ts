import { z } from "zod";

export const CreateStationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  room: z.string().uuid(),
});

export const UpdateStationSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .optional(),
  description: z.string().optional(),
});
