import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

export async function getUserProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    // O userId vem do middleware de autenticação
    const userId = request.user?.userId;
    
    if (!userId) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const getUserProfileUseCase = UseCaseFactory.createGetUserProfileUseCase();
    const result = await getUserProfileUseCase.execute(userId);

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error getting user profile:', error);
    
    if (error instanceof Error && error.message === 'User not found') {
      return reply.status(404).send({
        error: 'User not found'
      });
    }

    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}