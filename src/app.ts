import fastify from "fastify";
import { appRoutes } from "#http/routes.ts";
import { treeifyError, ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error.', issues: treeifyError(error) });
  }

  if(env.NODE_ENV !== 'prod') {
    console.error(error);
  } else {
    // TODO: Logs de erro em produção
  }

  return reply.status(500).send({ message: 'Internal Server Error.' });
});