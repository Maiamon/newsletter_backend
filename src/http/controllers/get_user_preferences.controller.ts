import type { FastifyReply, FastifyRequest } from "fastify";
import { GetUserPreferencesUseCase } from "#src/use-cases/get_user_preferences.ts";
import { PrismaUsersRepository } from "#src/repositories/prisma/prisma_users_repository.ts";

export async function getUserPreferences(request: FastifyRequest, reply: FastifyReply) {
  try {
    // O userId vem do middleware de autenticação
    const userId = request.user?.userId;
    
    if (!userId) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const usersRepository = new PrismaUsersRepository();
    const getUserPreferencesUseCase = new GetUserPreferencesUseCase(usersRepository);

    const result = await getUserPreferencesUseCase.execute(userId);

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error getting user preferences:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}