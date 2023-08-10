import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import { MAX_FREE_COUNTS } from "@/constants";
import prismadb from "./prismadb";

export const increaseApiLimit = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId, count: 1 },
    });
  }
};

export const checkApiLimit = async (req: NextApiRequest): Promise<boolean> => {
  const { userId } = getAuth(req);

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async (
  req: NextApiRequest
): Promise<number> => {
  const { userId } = getAuth(req);

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};
