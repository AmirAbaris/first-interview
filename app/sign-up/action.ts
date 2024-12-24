"use server";

import prisma from "@/db";
import bcrypt from "bcryptjs";
import { userSchema, User } from "@/lib/user";

export default async function createUser(user: User) {
  const parsedUser = userSchema.parse(user);

  const existingUser = await prisma.user.findUnique({
    where: { email: parsedUser.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(parsedUser.password, 10);

  return await prisma.user.create({
    data: {
      email: parsedUser.email,
      password: hashedPassword,
      role: parsedUser.isReporter ? "REPORTER" : "USER",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}
