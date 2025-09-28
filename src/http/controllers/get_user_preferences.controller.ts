import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

export async function getUserPreferences(request: FastifyRequest, reply: FastifyReply) {
  try {
    // O userId vem do middleware de autenticação
    const userId = request.user?.userId;
    
    if (!userId) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const getUserPreferencesUseCase = UseCaseFactory.createGetUserPreferencesUseCase();

    const result = await getUserPreferencesUseCase.execute(userId);

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error getting user preferences:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}