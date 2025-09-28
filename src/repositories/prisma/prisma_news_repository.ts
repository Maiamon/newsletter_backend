import { prisma } from "#lib/prisma.ts";
import { News } from "../../entities/news_entity.ts";
import { NewsRepository, SearchNewsParams, NewsList } from "../news_repository.ts";

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

    // Construir filtros de data baseado no período (últimos N dias/horas)
    let dateFilter = {};
    if (period) {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          // Últimas 24 horas (não apenas hoje)
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          // Últimos 7 dias (não apenas esta semana)
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          // Últimos 30 dias (não apenas este mês)
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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
}