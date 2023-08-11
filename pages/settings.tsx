import axios from "axios";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import Heading from "@/components/Heading";
import Spinner from "@/components/Spinner";
import SubscriptionButton from "@/components/SubscriptionButton";

const SettingsPage = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return (
    <DashboardLayout>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />

      <div className="px-4 lg:px-8 space-y-4">
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="text-muted-foreground text-sm">
              {isSubscribed
                ? "You are currently on a pro plan."
                : "You are currently on a free plan."}
            </div>

            <SubscriptionButton isSubscribed={isSubscribed} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
