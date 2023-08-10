import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.json("Should be POST request");
    return;
  }

  try {
    const { userId } = getAuth(req);
    const { prompt } = await req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!prompt) {
      return res.status(400).json({ message: "Propmpt is required" });
    }

    const freeTrial = await checkApiLimit(req);

    if (!freeTrial) {
      return res.status(403).json({ message: "Free trial has expired." });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
        },
      }
    );

    await increaseApiLimit(req);

    return res.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
