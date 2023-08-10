import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { ChatCompletionRequestMessage } from "openai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import BotAvatar from "@/components/BotAvatar";
import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { conversationFormSchema } from "@/constants/schema";
import useFreeCounter from "@/hooks/useFreeCounter";
import useProModal from "@/hooks/useProModal";
import { cn } from "@/lib/utils";

const ConversationPage = () => {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const { apiLimitCount, setApiLimitCount } = useFreeCounter();
  const { onOpen } = useProModal();

  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof conversationFormSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "system", content: response.data },
      ]);

      setApiLimitCount(apiLimitCount + 1);

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
          title="Conversation"
          description="The most advanced conversation model."
          icon={MessageSquare}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
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
                          placeholder="How do I calculate the radius of a circle?"
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

            {messages.length === 0 && !isLoading && (
              <div>
                <Empty label="No conversation started." />
              </div>
            )}

            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div
                  key={index + (message.content || "")}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}

                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConversationPage;
