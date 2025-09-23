import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma.ts";

export const app = fastify();

app.post('/news', async (request, reply) => {
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
});

app.get('/news', async (request, reply) => {
  const news = await prisma.news.findMany({
    orderBy: {
      publishedAt: 'desc'
    }
  });

  return reply.status(200).send({ news });
});