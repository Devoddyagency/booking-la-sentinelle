import { z } from "zod";

import { getAvailabilityFromSchedule } from "@calcom/lib/availability";
import { prisma } from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../../trpc";
import { ZScheduleInputSchema } from "./schedule.schema";

const ZUpdateScheduleInputSchema = ZScheduleInputSchema.extend({
  scheduleId: z.number(),
});

type UpdateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: typeof ZUpdateScheduleInputSchema._type;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  const { user } = ctx;
  const { scheduleId, name, schedule, timeZone } = input;

  // Verify ownership
  const existingSchedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
  });

  if (!existingSchedule || existingSchedule.userId !== user.id) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Schedule not found" });
  }

  const availability = schedule ? getAvailabilityFromSchedule(schedule) : [];

  // Update schedule and replace availability
  const updatedSchedule = await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      name,
      timeZone: timeZone,
      availability: {
        deleteMany: {},
        createMany: {
          data: availability.map((schedule) => ({
            days: schedule.days,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })),
        },
      },
    },
  });

  return {
    schedule: updatedSchedule,
  };
};

export default updateHandler;
