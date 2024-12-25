"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsCard } from "./NewsCard";
import { Button } from "../ui/button";
import { getNews } from "@/app/news-action/action";
import { Skeleton } from "../ui/skeleton";
import { NewsItem } from "@/lib/news-item";

export function NewsGrid() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Fetch news data
  const fetchNews = useCallback(async () => {
    setIsFetchingNextPage(true);
    try {
      const newData = await getNews(page);
      setNews((prevNews) => [...prevNews, ...newData]);
      setHasNextPage(newData.length === 10);
      setIsLoading(false);
      setIsFetchingNextPage(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNews();
  }, [page, fetchNews]);

  const loadMore = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center p-4">Failed to load news.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <NewsCard key={`${item.id}-${index}`} news={item} />
        ))}
      </div>
      <div className="flex justify-center p-4">
        {isFetchingNextPage ? (
          <Skeleton className="h-10 w-32" />
        ) : hasNextPage ? (
          <Button onClick={loadMore} disabled={isFetchingNextPage}>
            Load More
          </Button>
        ) : null}
      </div>
    </div>
  );
}
