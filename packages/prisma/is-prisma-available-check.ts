import { Prisma } from "@prisma/client";

import prisma from ".";

export async function isPrismaAvailableCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientInitializationError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      // Database might not be available at build time or tables don't exist yet.
      return false;
    } else {
      throw e;
    }
  }
}
