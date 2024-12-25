import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsList } from "@/components/news/NewsList";
import { NewsForm } from "@/components/forms/NewsForm";

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Cryptocurrency News</h1>
        <NewsForm />
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <NewsList />
        </Suspense>
      </div>
    </div>
  );
}
