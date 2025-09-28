import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";
import { InvalidCredentialsError } from "../../use-cases/errors/invalid_credentials";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = loginBodySchema.parse(request.body);

  try {
    const authenticateUseCase = UseCaseFactory.createAuthenticateUseCase();

    const { token, user } = await authenticateUseCase.execute({
      email,
      password
    });

    return reply.status(200).send({ token, user });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }

    throw err;
  }
}