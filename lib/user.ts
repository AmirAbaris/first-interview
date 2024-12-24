import { z } from "zod";

// Define the schema once
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isReporter: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type User = z.infer<typeof userSchema>;
