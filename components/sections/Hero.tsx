"use client";

import { getLatestNews } from "@/app/news-action/action";
import { NewsItem } from "@/lib/news-item";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: news,
    isLoading,
    isError,
  } = useQuery<NewsItem[]>({
    queryKey: ["latest-news"],
    queryFn: () => getLatestNews(5),
  });

  useEffect(() => {
    if (!news || news.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[460px] w-full">
        <Skeleton className="h-[460px] w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !news || news.length === 0) {
    return <div className="text-center p-4">Failed to load latest news.</div>;
  }

  const currentNews = news[currentIndex];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <Link href={`/news/${currentNews.slug}`}>
          <div className="relative h-[300px] sm:h-[400px] w-full">
            <Image
              src={currentNews.imageUrl}
              alt={currentNews.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white",
                "flex flex-col items-start"
              )}
            >
              <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                {currentNews.type}
              </Badge>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 line-clamp-2">
                {currentNews.title}
              </h2>
            </div>
          </div>
        </Link>
        <div className="hidden lg:absolute lg:bottom-4 lg:right-4 lg:flex lg:gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 sm:w-10 sm:h-10"
            onClick={() =>
              setCurrentIndex(
                (current) => (current - 1 + news.length) % news.length
              )
            }
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 sm:w-10 sm:h-10"
            onClick={() =>
              setCurrentIndex((current) => (current + 1) % news.length)
            }
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
