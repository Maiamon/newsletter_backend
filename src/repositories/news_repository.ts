import { News } from "../entities/news_entity";

export interface SearchNewsParams {
  page: number;
  limit: number;
  period?: 'day' | 'week' | 'month';
  category?: string;
}
export interface NewsList {
  news: News[];
  totalCount: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface NewsRepository {
  findById(id: number): Promise<News | null>;
  findMany(params: SearchNewsParams): Promise<NewsList>;
  findAllCategories(): Promise<Category[]>;
}