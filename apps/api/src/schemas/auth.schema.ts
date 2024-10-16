import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
  ipAddress: z.string().ip(),
});

export const SignupSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const SendResetPasswordLinkSchema = z.object({ email: z.string().email() });
export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: SignupSchema.shape.password,
  sessionId: z.string().optional(),
});
