import { z } from "zod";
import { MemberRole, MemberStatus } from "@/types/user";

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email(),
  image: z.string().url().optional(),
});

export const MemberSchema = z.object({
  email: z.string().email(),
  role: z.enum([MemberRole.HOST, MemberRole.MEMBER]),
  status: z.enum([MemberStatus.ACTIVE, MemberStatus.INACTIVE]),
});
