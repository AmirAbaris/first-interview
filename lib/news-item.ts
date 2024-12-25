export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  type: "NEWS" | "MARKETING NEWS";
  slug: string;
}
