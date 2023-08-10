import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
    const { prompt, amount = 1, resolution = "512x512" } = await req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!configuration.apiKey) {
      return res.status(500).json({ message: "OpenAI API Key not configured" });
    }

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (!resolution) {
      return res.status(400).json({ message: "Resolution is required" });
    }

    const freeTrial = await checkApiLimit(req);

    if (!freeTrial) {
      return res.status(403).json({ message: "Free trial has expired." });
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit(req);

    return res.json(response.data.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
