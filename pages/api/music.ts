import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
    const isSubscribed = await checkSubscription(req);

    if (!freeTrial && !isSubscribed) {
      return res.status(403).json({ message: "Free trial has expired." });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      }
    );

    if (!isSubscribed) {
      await increaseApiLimit(req);
    }

    return res.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
