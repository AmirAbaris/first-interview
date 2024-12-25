"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteNews, getNews } from "@/app/news-action/action";
import { NewsItem } from "@/lib/news-item";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export function NewsList() {
  const { isReporter } = useAuth();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: news,
    isLoading,
    isError,
  } = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const result = await getNews();
      return Array.isArray(result) ? result : [];
    },
  });

  const { mutate: deleteNewsItem } = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteNews(id),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  if (isLoading) return <Loader2 className="w-11 h-11 animate-spin mx-auto" />;
  if (isError) return <div>Error fetching news</div>;

  return (
    <div className="space-y-4">
      {Array.isArray(news) && news.length > 0 ? (
        news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.content}</p>
              <div className="mt-4 flex space-x-2">
                {isReporter() && (
                  <Button
                    variant="outline"
                    onClick={() => deleteNewsItem(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No news available.</div>
      )}
    </div>
  );
}
