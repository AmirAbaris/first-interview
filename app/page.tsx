import { NewsGrid } from "@/components/news/NewsGrid";
import Hero from "@/components/sections/Hero";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8 py-12 px-12">
        <Suspense
          fallback={<Skeleton className="h-[460px] w-full rounded-lg" />}
        >
          <Hero />
        </Suspense>
        <NewsGrid />
      </div>
    </div>
  );
}
