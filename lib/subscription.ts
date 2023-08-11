import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
};
