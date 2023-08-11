import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

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
    const { messages } = await req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!configuration.apiKey) {
      return res.status(500).json({ message: "OpenAI API Key not configured" });
    }

    if (!messages) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const freeTrial = await checkApiLimit(req);
    const isSubscribed = await checkSubscription(req);

    if (!freeTrial && !isSubscribed) {
      return res.status(403).json({ message: "Free trial has expired." });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    if (!isSubscribed) {
      await increaseApiLimit(req);
    }

    return res.json(response.data.choices[0].message?.content);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
