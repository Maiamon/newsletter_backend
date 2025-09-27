export interface News {
  id: number;
  title: string;
  content: string;
  publishedAt: Date;
  summary?: string;
  source?: string;
  categories: {
    id: number;
    name: string;
  }[];
}