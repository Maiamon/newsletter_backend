import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterUseCase } from "#use-cases/register_user.ts";
import { PrismaUsersRepository } from "#src/repositories/prisma/prisma_users_repository.ts";
import { UserAlreadyExistsError } from "#use-cases/errors/user_already_exists.ts";

export async function registerUser (request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(6),
    });

  const { email, name, password } = createUserBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({ 
      email, 
      name, 
      password 
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}