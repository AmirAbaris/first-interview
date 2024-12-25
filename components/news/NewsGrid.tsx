"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { NewsCard } from "./NewsCard";
import { Button } from "../ui/button";
import { getNews } from "@/app/news-action/action";
import { Skeleton } from "../ui/skeleton";

export function NewsGrid() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["news"],
    queryFn: ({ pageParam = 1 }) => getNews(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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
        {data?.pages.map((page) =>
          page.map((item) => <NewsCard key={item.id} news={item} />)
        )}
      </div>
      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage ? (
          <Skeleton className="h-10 w-32" />
        ) : hasNextPage ? (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            Load More
          </Button>
        ) : null}
      </div>
    </div>
  );
}
