import { z } from "zod";
import { prisma } from "#lib/prisma.ts";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function registerNews(request: FastifyRequest, reply: FastifyReply) {
  const createNewsBodySchema = z.object({
    title: z.string(),
    summary: z.string().optional(),
    source: z.string(),
    content: z.string().optional(),
  });

  const { title, summary, source, content } = createNewsBodySchema.parse(request.body);

  await prisma.news.create({
    data: { 
      title, 
      summary, 
      source, 
      content: content ?? "", // Ensure content is always a string
    }
  })

  return reply.status(201).send();
}