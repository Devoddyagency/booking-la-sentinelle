import type { TNoShowInputSchema } from "./markHostAsNoShow.schema";

type NoShowOptions = {
  input: TNoShowInputSchema;
};

export const noShowHandler = async ({ input: _input }: NoShowOptions) => {
  // handleMarkNoShow was removed
  return { success: false, message: "No-show handling removed" };
};

export default noShowHandler;
