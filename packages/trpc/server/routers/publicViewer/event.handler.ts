import type { TEventInputSchema } from "./event.schema";

interface EventHandlerOptions {
  input: TEventInputSchema;
}

export const eventHandler = async ({ input: _input }: EventHandlerOptions) => {
  // EventRepository was removed
  return null;
};

export default eventHandler;
