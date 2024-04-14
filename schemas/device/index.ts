import { z } from "zod";
import { DeviceType } from "@/types/devices";

export const CreateDeviceSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(DeviceType),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  room: z.string().uuid().optional(),
});
