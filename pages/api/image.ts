import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    return res.json(response.data.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
