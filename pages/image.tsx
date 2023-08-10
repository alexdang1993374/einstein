import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";
import FormSelect from "@/components/FormSelect";
import Heading from "@/components/Heading";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  amountOptions,
  imageFormSchema,
  resolutionOptions,
} from "@/constants/schema";
import useFreeCounter from "@/hooks/useFreeCounter";

const ImagePage = () => {
  const [images, setImages] = useState<string[]>([]);
  const { apiLimitCount, setApiLimitCount } = useFreeCounter();

  const form = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof imageFormSchema>) => {
    try {
      setImages([]);

      const response = await axios.post("/api/image", values);

      const urls: string[] = response.data.map(
        (image: { url: string }) => image.url
      );

      setImages(urls);

      setApiLimitCount(apiLimitCount + 1);

      form.reset();
    } catch (error) {
      // TODO: Open Pro Modal
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Heading
          title="Image Generation"
          description="Turn your prompt into an image."
          icon={ImageIcon}
          iconColor="text-pink-700"
          bgColor="bg-pink-700/10"
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
                      className="col-span-12 lg:col-span-6"
                    >
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="A picture of a horse in space."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormSelect
                  form={form}
                  isLoading={isLoading}
                  options={amountOptions}
                  name="amount"
                />

                <FormSelect
                  form={form}
                  isLoading={isLoading}
                  options={resolutionOptions}
                  name="resolution"
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
              <div className="p-20">
                <Loader />
              </div>
            )}

            {images.length === 0 && !isLoading && (
              <div>
                <Empty label="No images generated." />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
              {images.map((src) => (
                <Card key={src} className="rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image alt="Image" fill src={src} />
                  </div>

                  <CardFooter className="p-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => window.open(src)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImagePage;
