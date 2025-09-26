import { NewsRepository, SearchNewsParams, SearchNewsResult } from "../news_repository.ts";
import { News, Prisma } from "../../generated/prisma/index.js";

export interface NewsData {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  content: string;
  publishedAt: Date;
  categories: {
    id: number;
    name: string;
  }[];
}

export interface CreateNewsData {
  title: string;
  summary?: string | null;
  source?: string | null;
  content: string;
  publishedAt?: Date;
  categories?: {
    id: number;
    name: string;
  }[];
}

export class InMemoryNewsRepository implements NewsRepository {
  public items: NewsData[] = [];
  private currentId = 1;

  async searchNews(params: SearchNewsParams): Promise<SearchNewsResult> {
    const { page, limit, period, category } = params;
    
    let filteredNews = [...this.items];

    // Filtrar por período
    if (period) {
      const now = new Date();
      let dateThreshold: Date;

      switch (period) {
        case 'day':
          dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = new Date(0);
      }

      filteredNews = filteredNews.filter(news => news.publishedAt >= dateThreshold);
    }

    // Filtrar por categoria
    if (category) {
      filteredNews = filteredNews.filter(news => 
        news.categories.some(cat => cat.name.toLowerCase() === category.toLowerCase())
      );
    }

    // Ordenar por data de publicação (mais recente primeiro)
    filteredNews.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Calcular paginação
    const totalCount = filteredNews.length;
    const offset = (page - 1) * limit;
    const paginatedNews = filteredNews.slice(offset, offset + limit);

    return {
      news: paginatedNews.map(news => ({
        id: news.id,
        title: news.title,
        summary: news.summary,
        source: news.source,
        content: news.content,
        publishedAt: news.publishedAt,
        categories: news.categories
      })),
      totalCount
    };
  }

  async create(data: Prisma.NewsCreateInput): Promise<News> {
    // Para o repositório in-memory, simplificamos o input do Prisma
    const publishedAt = typeof data.publishedAt === 'string' ? new Date(data.publishedAt) : data.publishedAt || new Date();
    
    const news: NewsData = {
      id: this.currentId++,
      title: data.title,
      summary: data.summary || null,
      source: data.source || null,
      content: data.content,
      publishedAt: publishedAt,
      categories: [] // Para o método create base, não lidamos com categorias
    };

    this.items.push(news);

    return {
      id: news.id,
      title: news.title,
      summary: news.summary,
      source: news.source,
      content: news.content,
      publishedAt: news.publishedAt
    };
  }

  // Método auxiliar para adicionar notícias com categorias nos testes
  async createWithCategories(data: CreateNewsData): Promise<NewsData> {
    const news: NewsData = {
      id: this.currentId++,
      title: data.title,
      summary: data.summary || null,
      source: data.source || null,
      content: data.content,
      publishedAt: data.publishedAt || new Date(),
      categories: data.categories || []
    };

    this.items.push(news);
    return news;
  }
}