import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "../../news-action/action";

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const news = await getNewsBySlug(params.slug);

  if (!news) {
    notFound();
  }

  return (
    <article className="container max-w-4xl mx-auto py-12">
      <div className="space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary">{news.type}</Badge>
          <h1 className="text-4xl font-bold">{news.title}</h1>
        </div>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          {news.content}
        </div>
      </div>
    </article>
  );
}
