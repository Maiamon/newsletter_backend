import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

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
    
    const searchNewsUseCase = UseCaseFactory.createSearchNewsUseCase();

    // Executar use case
    const result = await searchNewsUseCase.execute({
      page,
      limit,
      period,
      category
    });

    return reply.status(200).send(result);

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