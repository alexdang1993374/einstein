import axios from "axios";
import { Zap } from "lucide-react";
import { useEffect } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import useFreeCounter from "@/hooks/useFreeCounter";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface IGetApiLimitCountResponse {
  data: number;
}

const FreeCounter = () => {
  const { apiLimitCount, setApiLimitCount } = useFreeCounter();

  useEffect(() => {
    let isMounted = true;

    const getApiLimitCount = async () => {
      const response: IGetApiLimitCountResponse = await axios.get(
        "/api/layout"
      );

      if (isMounted) {
        setApiLimitCount(response.data);
      }
    };

    getApiLimitCount();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLimitCount]);

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

          <Button className="w-full" variant="premium">
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
