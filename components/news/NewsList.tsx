"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteNews, editNews, getNews } from "@/app/news-action/action";
import { NewsItem } from "@/lib/news-item";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function NewsList() {
  const { isReporter } = useAuth();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");

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

  const { mutate: editNewsItem, isPending } = useMutation<
    void,
    Error,
    { id: string; title: string; content: string }
  >({
    mutationFn: ({ id, title, content }) => editNews(id, { title, content }),
    onMutate: (data) => {
      setEditingId(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setEditingId(null);
      setEditedTitle("");
      setEditedContent("");
    },
    onError: () => {
      setEditingId(null);
    },
  });

  const handleSaveEdit = (id: string) => {
    editNewsItem({ id, title: editedTitle, content: editedContent });
  };

  const handleEdit = (id: string, title: string, content: string) => {
    setEditingId(id);
    setEditedTitle(title);
    setEditedContent(content);
  };

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
              {editingId === item.id ? (
                <div>
                  <Input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-2 mb-2 border rounded-md"
                  />
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="mt-4 flex space-x-2">
                    <Button
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{item.content}</p>
                  <div className="mt-4 flex space-x-2">
                    {isReporter() && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleEdit(item.id, item.title, item.content)
                          }
                          disabled={editingId === item.id}
                        >
                          Edit
                        </Button>
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
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No news available.</div>
      )}
    </div>
  );
}
