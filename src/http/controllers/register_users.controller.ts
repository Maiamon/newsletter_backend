import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { registerUseCase } from "../../use-cases/register_user";

export async function registerUser (request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(6),
    });

  const { email, name, password } = createUserBodySchema.parse(request.body);

  try {
    await registerUseCase({ email, name, password });
  } catch {
    return reply.status(409).send({ message: "User already exists" });
  }

  return reply.status(201).send();
}