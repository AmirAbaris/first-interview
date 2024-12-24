import { z } from "zod";

// Define the schema once
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isReporter: z.boolean(),
});

// Infer the TypeScript type from the schema
export type User = z.infer<typeof userSchema>;
