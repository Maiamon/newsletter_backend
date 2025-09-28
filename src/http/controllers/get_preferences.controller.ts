import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

export async function getPreferences(_request: FastifyRequest, reply: FastifyReply) {
  try {
    // Reutilizar o use case de categorias para mostrar todas as preferências disponíveis
    const getCategoriesUseCase = UseCaseFactory.createGetCategoriesUseCase();

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