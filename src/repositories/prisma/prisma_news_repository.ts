import { prisma } from "#lib/prisma.ts";
import { News } from "../../entities/news_entity.ts";
import { NewsRepository, SearchNewsParams, NewsList, Category } from "../news_repository.ts";

export class PrismaNewsRepository implements NewsRepository {
  async findById(id: number): Promise<News | null> {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!news) {
      return null;
    }

    return {
      id: news.id,
      title: news.title,
      content: news.content,
      source: news.source ?? undefined,
      summary: news.summary ?? undefined,
      publishedAt: new Date(news.publishedAt),
      categories: news.categories.map(category => ({
        id: category.id,
        name: category.name
      }))
    };
  }

  async findMany(params: SearchNewsParams): Promise<NewsList> {
    const { page, limit, period, category } = params;
    
    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Construir filtros de data baseado no período
    let dateFilter = {};
    if (period) {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          // Início do dia atual (00:00:00)
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          // Início da semana atual (domingo)
          const dayOfWeek = now.getDay();
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
          break;
        case 'month':
          // Início do mês atual
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      dateFilter = {
        publishedAt: {
          gte: startDate,
          lte: now
        }
      };
    }

    // Construir filtro de categoria
    let categoryFilter = {};
    if (category) {
      categoryFilter = {
        categories: {
          some: {
            name: {
              contains: category,
              mode: 'insensitive'
            }
          }
        }
      };
    }

    // Combinar todos os filtros
    const whereClause = {
      ...dateFilter,
      ...categoryFilter
    };

    // Buscar notícias com paginação e filtros
    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
        where: whereClause,
        include: {
          categories: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.news.count({
        where: whereClause
      })
    ]);

    return {
      news: news.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        publishedAt: n.publishedAt,
        summary: n.summary ?? undefined,
        source: n.source ?? undefined,
        categories: n.categories.map(c => ({
          id: c.id,
          name: c.name
        }))
      })),
      totalCount
    };
  }

  async findAllCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }
}