"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import addNews from "@/app/news-action/action";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["NEWS", "MARKETING NEWS"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
});

export function NewsForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "NEWS",
    },
  });

  const mutation = useMutation({
    mutationFn: addNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      form.reset();
    },
  });

  function onSubmit(values: {
    title: string;
    content: string;
    type: "NEWS" | "MARKETING NEWS";
  }) {
    const newsItem = {
      ...values,
      imageUrl:
        "https://utfs.io/f/Pp3COMsbGerIHKmvgI3XoiTOx4U5pAblNM1CFdyVkZu0gceI",
    };

    mutation.mutate(newsItem);
  }

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter news title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter news content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <p>Add</p>
          )}
        </Button>
      </form>
    </Form>
  );
}
