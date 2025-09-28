import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

export async function getCategories(_request: FastifyRequest, reply: FastifyReply) {
  try {
    // Executar use case
    const getCategoriesUseCase = UseCaseFactory.createGetCategoriesUseCase();
    const result = await getCategoriesUseCase.execute();

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error getting categories:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}