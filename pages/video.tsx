import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { VideoIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { conversationFormSchema } from "@/constants/schema";
import useFreeCounter from "@/hooks/useFreeCounter";
import useProModal from "@/hooks/useProModal";
import useSubscription from "@/hooks/useSubscription";

const VideoPage = () => {
  const [video, setVideo] = useState<string>();

  const { apiLimitCount, setApiLimitCount } = useFreeCounter();
  const { onOpen } = useProModal();
  const { isSubscribed } = useSubscription();

  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof conversationFormSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post("/api/video", values);

      setVideo(response.data[0]);

      if (!isSubscribed) {
        setApiLimitCount(apiLimitCount + 1);
      }

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        onOpen();
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Heading
          title="Video Generation"
          description="Turn your prompt into video."
          icon={VideoIcon}
          iconColor="text-orange-700"
          bgColor="bg-orange-700/10"
        />

        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem
                      key={field.name}
                      className="col-span-12 lg:col-span-10"
                    >
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Spongebob fighting Goku"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}

            {!video && !isLoading && (
              <div>
                <Empty label="No video generated." />
              </div>
            )}

            {video && (
              <video
                controls
                className="w-full aspect-video mt-8 rounded-lg border bg-black"
              >
                <source src={video} />
              </video>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoPage;
