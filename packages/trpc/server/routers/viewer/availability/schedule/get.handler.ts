import { z } from "zod";

import { prisma } from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../trpc";

const ZGetScheduleInputSchema = z.object({
  scheduleId: z.number().optional(),
});

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: typeof ZGetScheduleInputSchema._type;
};

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const { user } = ctx;
  const { scheduleId } = input;

  if (scheduleId) {
    const schedule = await prisma.schedule.findUnique({
      where: {
        id: scheduleId,
      },
      include: {
        availability: true,
      },
    });

    if (!schedule || schedule.userId !== user.id) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Schedule not found" });
    }
    return { availability: schedule };
  }

  // if no scheduleId provided, maybe return default?
  // The frontend calls get({ scheduleId: undefined }) when creating new.
  // In that case it just wants to know if there is a default?
  // SetupAvailability.tsx uses: queryAvailability?.data?.availability || DEFAULT_SCHEDULE
  // So if we return null, it uses default.

  return { availability: null };
};

export default getHandler;
