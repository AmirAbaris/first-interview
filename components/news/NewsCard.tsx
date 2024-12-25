import { NewsItem } from "@/lib/news-item";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        <div className="relative min-h-48 w-full">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader className="space-y-2 flex-1">
          <Badge className="w-fit" variant="secondary">
            {news.type}
          </Badge>
          <h3 className="font-bold line-clamp-2">{news.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {news.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
