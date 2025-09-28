import type { FastifyReply, FastifyRequest } from "fastify";
import { GetCategoriesUseCase } from "#src/use-cases/get_categories.ts";
import { PrismaCategoriesRepository } from "#src/repositories/prisma/prisma_categories_repository.ts";

export async function getPreferences(_request: FastifyRequest, reply: FastifyReply) {
  try {
    // Reutilizar o use case de categorias para mostrar todas as preferências disponíveis
    const categoriesRepository = new PrismaCategoriesRepository();
    const getCategoriesUseCase = new GetCategoriesUseCase(categoriesRepository);

    const result = await getCategoriesUseCase.execute();

    return reply.status(200).send({
      preferences: result.categories,
      totalCount: result.totalCount
    });

  } catch (error) {
    console.error('Error getting preferences:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}