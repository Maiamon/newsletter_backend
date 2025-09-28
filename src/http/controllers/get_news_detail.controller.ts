import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UseCaseFactory } from "#src/factories/use-case-factory.ts";

export async function getNewsDetail(request: FastifyRequest, reply: FastifyReply) {
  const getNewsParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const { id } = getNewsParamsSchema.parse(request.params);

  try {
    const getNewsDetailUseCase = UseCaseFactory.createGetNewsDetailUseCase();

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