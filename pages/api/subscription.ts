import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

import { checkSubscription } from "@/lib/subscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.json("Should be GET request");
    return;
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await checkSubscription(req);

    return res.json(response);
  } catch (error) {
    console.log("[CHECK_SUBSCRIPTION_ERROR]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
