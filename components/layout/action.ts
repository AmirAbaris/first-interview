"use server";

import prisma from "@/db";

export async function checkUserAuth(email: string | null) {
  if (!email) return null;

  const targetUser = await prisma.user.findUnique({
    where: { email },
  });

  return targetUser;
}
