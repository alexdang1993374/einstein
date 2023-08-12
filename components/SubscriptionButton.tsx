import axios from "axios";
import { Zap } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "./ui/button";

interface SubscriptionButtonProps {
  isSubscribed: boolean;
}

const SubscriptionButton = ({
  isSubscribed = false,
}: SubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      variant={isSubscribed ? "default" : "premium"}
      onClick={onClick}
    >
      {isSubscribed ? "Manage Subscription" : "Upgrade"}
      {!isSubscribed && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  );
};

export default SubscriptionButton;
