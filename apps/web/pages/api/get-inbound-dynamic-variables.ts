import type { NextApiRequest, NextApiResponse } from "next";

import { defaultHandler } from "@calcom/lib/server";

// Slots/availability functionality removed
async function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(404).json({ message: "This endpoint has been removed" });
}

export default defaultHandler({
  POST: Promise.resolve({ default: handler }),
});
