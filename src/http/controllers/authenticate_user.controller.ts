import z from "zod";
import { comparePasswords } from "#lib/bcrypt.ts";
import { generateJWT } from "#lib/jwt.ts";
import { prisma } from "#lib/prisma.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = loginBodySchema.parse(request.body);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !(await comparePasswords(password, user.password_hash))) {
    return reply.status(401).send({ message: "Invalid email or password" });
  }

  const token = await generateJWT(
    { userId: user.id, email: user.email }
  );
  return reply.status(200).send({ token });
}