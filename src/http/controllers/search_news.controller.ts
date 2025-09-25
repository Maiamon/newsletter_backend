import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "#lib/prisma.ts";

// Schema para validar query parameters
const searchNewsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  period: z.enum(['day', 'week', 'month']).optional(),
  category: z.string().optional()
});

export async function searchNews(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Validar query parameters
    const { page, limit, period, category } = searchNewsQuerySchema.parse(request.query);

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

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return reply.status(200).send({
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage
      },
      filters: {
        period: period || null,
        category: category || null
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Invalid query parameters',
        details: error.issues
      });
    }

    console.error('Error searching news:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}