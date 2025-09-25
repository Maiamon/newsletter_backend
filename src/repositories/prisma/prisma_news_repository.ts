import { prisma } from "#lib/prisma.ts";
import { Prisma, News } from "../../generated/prisma/index.js";
import { NewsRepository, SearchNewsParams, SearchNewsResult } from "../news_repository.ts";

export class PrismaNewsRepository implements NewsRepository {
  async searchNews(params: SearchNewsParams): Promise<SearchNewsResult> {
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
      news,
      totalCount
    };
  }

  async create(data: Prisma.NewsCreateInput): Promise<News> {
    const news = await prisma.news.create({
      data,
      include: {
        categories: true
      }
    });

    return news;
  }
}