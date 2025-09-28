import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { GetNewsDetailUseCase } from "#use-cases/get_news_detail.ts";
import { PrismaNewsRepository } from "#src/repositories/prisma/prisma_news_repository.ts";

export async function getNewsDetail(request: FastifyRequest, reply: FastifyReply) {
  const getNewsParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const { id } = getNewsParamsSchema.parse(request.params);

  try {
    const newsRepository = new PrismaNewsRepository();
    const getNewsDetailUseCase = new GetNewsDetailUseCase(newsRepository);

    const news = await getNewsDetailUseCase.execute({ id });

    if (!news) {
      return reply.status(404).send({ 
        message: 'Notícia não encontrada' 
      });
    }

    return reply.status(200).send({ news });
  } catch (err) {
    console.error('Error getting news detail:', err);
    throw err;
  }
}