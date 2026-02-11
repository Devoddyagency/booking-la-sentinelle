import type { NextApiRequest, NextApiResponse } from "next";

import { defaultHandler } from "@calcom/lib/server";

// Daily video recording webhook handler - booking dependencies removed
async function handler(_req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ message: "Daily video webhook handler disabled" });
}

export default defaultHandler({
  POST: Promise.resolve({ default: handler }),
});
