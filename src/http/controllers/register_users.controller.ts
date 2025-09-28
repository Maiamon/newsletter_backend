import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";
import { UserAlreadyExistsError } from "#use-cases/errors/user_already_exists.ts";

export async function registerUser (request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(6),
    });

  const { email, name, password } = createUserBodySchema.parse(request.body);

  try {
    const registerUseCase = UseCaseFactory.createRegisterUserUseCase();

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