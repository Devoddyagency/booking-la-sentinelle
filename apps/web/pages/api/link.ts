import type { NextApiRequest, NextApiResponse } from "next";

import { defaultResponder } from "@calcom/lib/server";

// Booking confirmation link functionality removed
async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ message: "This endpoint has been removed" });
}

export default defaultResponder(handler);
