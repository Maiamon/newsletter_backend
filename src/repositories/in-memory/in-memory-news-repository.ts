import { NewsRepository, SearchNewsParams, NewsList } from "../news_repository.ts";
import { News } from "../../entities/news_entity.ts";

export class InMemoryNewsRepository implements NewsRepository {
  public items: News[] = [];
  private currentId = 1;
  async findById(id: number): Promise<News | null> {
    const news = this.items.find(item => item.id === id);
    return Promise.resolve(news ? { ...news } : null);
  }

  async findMany(params: SearchNewsParams): Promise<NewsList> {
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

  async create(data: Omit<News, 'id'>): Promise<News> {
    const news: News = {
      id: this.currentId++,
      title: data.title,
      summary: data.summary || undefined,
      source: data.source || undefined,
      content: data.content,
      publishedAt: data.publishedAt || new Date(),
      categories: data.categories || []
    };

    this.items.push(news);
    return news;
  }
}