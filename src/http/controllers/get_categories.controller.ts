import type { FastifyReply, FastifyRequest } from "fastify";
import { GetCategoriesUseCase } from "#src/use-cases/get_categories.ts";
import { PrismaNewsRepository } from "#src/repositories/prisma/prisma_news_repository.ts";

export async function getCategories(_request: FastifyRequest, reply: FastifyReply) {
  try {
    // Instanciar repositório e use case
    const newsRepository = new PrismaNewsRepository();
    const getCategoriesUseCase = new GetCategoriesUseCase(newsRepository);

    // Executar use case
    const result = await getCategoriesUseCase.execute();

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error getting categories:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}