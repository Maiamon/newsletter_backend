import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateUserPreferencesUseCase } from "#src/use-cases/update_user_preferences.ts";
import { PrismaUsersRepository } from "#src/repositories/prisma/prisma_users_repository.ts";
import { PrismaCategoriesRepository } from "#src/repositories/prisma/prisma_categories_repository.ts";

const updatePreferencesBodySchema = z.object({
  categoryIds: z.array(z.number().int().positive()).min(0).max(50) // Máximo de 50 categorias
});

export async function updateUserPreferences(request: FastifyRequest, reply: FastifyReply) {
  try {
    // O userId vem do middleware de autenticação
    const userId = request.user?.userId;
    
    if (!userId) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const { categoryIds } = updatePreferencesBodySchema.parse(request.body);

    const usersRepository = new PrismaUsersRepository();
    const categoriesRepository = new PrismaCategoriesRepository();
    const updateUserPreferencesUseCase = new UpdateUserPreferencesUseCase(
      usersRepository, 
      categoriesRepository
    );

    const result = await updateUserPreferencesUseCase.execute({
      userId,
      categoryIds
    });

    return reply.status(200).send(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Invalid request data',
        details: error.issues
      });
    }

    if (error instanceof Error && error.message.includes('not found')) {
      return reply.status(404).send({
        error: error.message
      });
    }

    if (error instanceof Error && error.message.includes('Invalid category')) {
      return reply.status(400).send({
        error: error.message
      });
    }

    console.error('Error updating user preferences:', error);
    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}