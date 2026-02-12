import { getAvailabilityFromSchedule } from "@calcom/lib/availability";
import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../../trpc";
import type { ZScheduleInputSchema } from "./schedule.schema";

type CreateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: typeof ZScheduleInputSchema._type;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx;
  const { name, schedule, timeZone } = input;

  const availability = schedule ? getAvailabilityFromSchedule(schedule) : [];

  const createdSchedule = await prisma.schedule.create({
    data: {
      userId: user.id,
      name,
      timeZone: timeZone || user.timeZone,
      availability: {
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
    schedule: createdSchedule,
  };
};

export default createHandler;
