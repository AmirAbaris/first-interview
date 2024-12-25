"use server";

import { revalidatePath } from "next/cache";
import { NewsItem } from "@/lib/news-item";

// Dummy data
let news: NewsItem[] = [
  {
    id: "1",
    title: "Major Cryptocurrency Exchange Announces New Features",
    content:
      "A leading cryptocurrency exchange has unveiled a suite of new features aimed at improving user experience and security.",
    imageUrl:
      "https://utfs.io/f/Pp3COMsbGerIjjdlfF3HK3RnI178WC2XuVJEYbpzlBOxUT4a",
    type: "NEWS",
    slug: "major-cryptocurrency-exchange-announces-new-features",
  },
  {
    id: "2",
    title: "Bitcoin Reaches New All-Time High",
    content:
      "Bitcoin has surpassed its previous record, reaching a new all-time high price amid increased institutional adoption.",
    imageUrl:
      "https://utfs.io/f/Pp3COMsbGerIHKmvgI3XoiTOx4U5pAblNM1CFdyVkZu0gceI",
    type: "MARKETING NEWS",
    slug: "bitcoin-reaches-new-all-time-high",
  },
  {
    id: "3",
    title: "Ethereum 2.0 Upgrade: What You Need to Know",
    content:
      "The long-awaited Ethereum 2.0 upgrade is set to roll out, promising improved scalability and reduced energy consumption.",
    imageUrl:
      "https://utfs.io/f/Pp3COMsbGerIu8MOOP4Rjso52yTLJQfvzDGqMnNgBcHUCu0t",
    type: "NEWS",
    slug: "ethereum-2-upgrade-what-you-need-to-know",
  },
  {
    id: "4",
    title:
      "Decentralized Finance (DeFi) Surpasses $100 Billion in Total Value Locked",
    content:
      "The DeFi sector continues its explosive growth, with the total value locked in DeFi protocols exceeding $100 billion.",
    imageUrl:
      "https://utfs.io/f/Pp3COMsbGerIu8MOOP4Rjso52yTLJQfvzDGqMnNgBcHUCu0t",
    type: "MARKETING NEWS",
    slug: "defi-surpasses-100-billion-tvl",
  },
  {
    id: "5",
    title: "NFT Market Expands Beyond Digital Art",
    content:
      "Non-fungible tokens (NFTs) are finding new use cases beyond digital art, including music, virtual real estate, and gaming.",
    imageUrl:
      "https://utfs.io/f/Pp3COMsbGerIsdnhbtxF8LTqcZrpEdW1xJIyj30AKkbnQ7Mm",
    type: "NEWS",
    slug: "nft-market-expands-beyond-digital-art",
  },
];

export default async function addNews(
  item: Omit<NewsItem, "id" | "slug">
): Promise<NewsItem> {
  const newItem = {
    ...item,
    id: Date.now.toString(),
    slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  };
  revalidatePath("/news");

  await new Promise<NewsItem>((resolve) => {
    setTimeout(() => {
      news.push(newItem);
      resolve(newItem);
    }, 2000);
  });

  return newItem;
}

export async function deleteNews(id: string): Promise<void> {
  news = news.filter((item) => item.id !== id);
  revalidatePath("/news");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return news.find((item) => item.slug === slug) || null;
}

export async function getLatestNews(limit: number = 5): Promise<NewsItem[]> {
  return news.slice(0, limit);
}

export async function getNews(
  page: number = 1,
  pageSize: number = 10
): Promise<NewsItem[]> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return news.slice(start, end);
}

export async function editNews(
  id: string,
  updatedItem: { title: string; content: string }
): Promise<void> {
  const newsItem = news.find((item) => item.id === id);

  if (newsItem) {
    newsItem.title = updatedItem.title;
    newsItem.content = updatedItem.content;

    newsItem.slug = updatedItem.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    revalidatePath("/news");

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
