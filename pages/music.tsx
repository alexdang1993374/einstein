import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Music } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

const MusicPage = () => {
  const [music, setMusic] = useState<string>();

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
      setMusic(undefined);

      const response = await axios.post("/api/music", values);

      setMusic(response.data.audio);

      if (!isSubscribed) {
        setApiLimitCount(apiLimitCount + 1);
      }

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        onOpen();
      }
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Heading
          title="Music Generation"
          description="Turn your prompt into music."
          icon={Music}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
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
                          placeholder="Piano solo"
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

            {!music && !isLoading && (
              <div>
                <Empty label="No music generated." />
              </div>
            )}

            {music && (
              <audio controls className="w-full mt-8">
                <source src={music} />
              </audio>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MusicPage;
