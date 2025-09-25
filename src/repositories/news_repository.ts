import { Prisma, News } from "../generated/prisma/index.js";

export interface SearchNewsParams {
  page: number;
  limit: number;
  period?: 'day' | 'week' | 'month';
  category?: string;
}

export interface SearchNewsResult {
  news: (News & {
    categories: {
      id: number;
      name: string;
    }[];
  })[];
  totalCount: number;
}

export interface NewsRepository {
  searchNews(params: SearchNewsParams): Promise<SearchNewsResult>
  create(data: Prisma.NewsCreateInput): Promise<News>
}