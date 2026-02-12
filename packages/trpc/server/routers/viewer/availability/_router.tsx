import { z } from "zod";

import { router } from "../../../../trpc";
import authedProcedure from "../../../procedures/authedProcedure";
import { createHandler } from "./schedule/create.handler";
import { getHandler } from "./schedule/get.handler";
import { ZScheduleInputSchema } from "./schedule/schedule.schema";
import { updateHandler } from "./schedule/update.handler";

const ZUpdateScheduleInputSchema = ZScheduleInputSchema.extend({
  scheduleId: z.number(),
});

const ZGetScheduleInputSchema = z.object({
  scheduleId: z.number().optional().nullable(),
});

export const scheduleRouter = router({
  create: authedProcedure.input(ZScheduleInputSchema).mutation(createHandler),
  update: authedProcedure.input(ZUpdateScheduleInputSchema).mutation(updateHandler),
  get: authedProcedure.input(ZGetScheduleInputSchema).query(getHandler),
});

export const availabilityRouter = router({
  schedule: scheduleRouter,
});
