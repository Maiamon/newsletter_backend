import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

const updateProfileBodySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100, "Name too long")
});

export async function updateUserProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    // O userId vem do middleware de autenticação
    const userId = request.user?.userId;
    
    if (!userId) {
      return reply.status(401).send({
        error: 'User not authenticated'
      });
    }

    const { name } = updateProfileBodySchema.parse(request.body);

    const updateUserProfileUseCase = UseCaseFactory.createUpdateUserProfileUseCase();
    const result = await updateUserProfileUseCase.execute({
      userId,
      name
    });

    return reply.status(200).send(result);

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Erro de validação do Zod
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.issues
      });
    }

    // Erro de negócio
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return reply.status(404).send({
          error: 'User not found'
        });
      }
      
      if (error.message === 'Name cannot be empty') {
        return reply.status(400).send({
          error: 'Name cannot be empty'
        });
      }
    }

    return reply.status(500).send({
      error: 'Internal server error'
    });
  }
}