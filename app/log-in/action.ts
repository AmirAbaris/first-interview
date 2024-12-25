"use server";

import prisma from "@/db";
import { loginSchema } from "@/lib/user";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const login = async (data: z.infer<typeof loginSchema>) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};
