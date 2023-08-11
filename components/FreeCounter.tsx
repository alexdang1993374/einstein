import axios from "axios";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import useFreeCounter from "@/hooks/useFreeCounter";
import useProModal from "@/hooks/useProModal";
import useSubscription from "@/hooks/useSubscription";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface IGetApiLimitCountResponse {
  data: number;
}

const FreeCounter = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { apiLimitCount, setApiLimitCount } = useFreeCounter();
  const { onOpen } = useProModal();
  const { isSubscribed, setIsSubscribed } = useSubscription();

  useEffect(() => {
    let isMounted: boolean = true;

    const checkIsSubscribed = async () => {
      try {
        const response = await axios.get("/api/subscription");

        if (isMounted) {
          setIsSubscribed(response.data);
        }
      } catch (error) {
        console.log("CHECK_IS_SUBSCRIBED_ERROR", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkIsSubscribed();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted: boolean = true;

    const getApiLimitCount = async () => {
      try {
        const response: IGetApiLimitCountResponse = await axios.get(
          "/api/layout"
        );

        if (isMounted) {
          setApiLimitCount(response.data);
        }
      } catch (error) {
        console.log("GET_API_LIMIT_COUNT_ERROR", error);
      }
    };

    getApiLimitCount();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLimitCount]);

  if (isSubscribed || isLoading) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>

            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>

          <Button className="w-full" variant="premium" onClick={onOpen}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
