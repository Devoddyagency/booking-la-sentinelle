import { z } from "zod";

export const ZScheduleInputSchema = z.object({
  name: z.string(),
  timeZone: z.string().optional(),
  schedule: z
    .array(
      z.array(
        z.object({
          start: z.date(),
          end: z.date(),
        })
      )
    )
    .optional(),
});
