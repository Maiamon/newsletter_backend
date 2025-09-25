import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticateUseCase } from "#use-cases/authenticate_user.ts";
import { PrismaUsersRepository } from "#src/repositories/prisma/prisma_users_repository.ts";
import { InvalidCredentialsError } from "../../use-cases/errors/invalid_credentials";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = loginBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    const { token } = await authenticateUseCase.execute({
      email,
      password
    });

    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }

    throw err;
  }
}